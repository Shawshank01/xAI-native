document.getElementById('chatForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent form reload
    
    const question = document.getElementById('questionInput').value;  // Get the user's input
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = 'Loading...';  // Show loading state
    
    try {
        let history = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];
        // Add system prompt if not present
        if (history.length === 0 || history[0].role !== 'system') {
            history.unshift({
                role: 'system',
                content: [{ type: 'text', text: 'You are a helpful and funny assistant.' }]
            });
        }
        // Add the new user message in xAI format
        history.push({
            role: 'user',
            content: [{ type: 'text', text: question }]
        });
        // Send the full history to the backend
        const serverResponse = await fetch('http://localhost:3000/ask-xai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: history }),
        });
        
        if (!serverResponse.ok) {
            const errorText = await serverResponse.text();
            throw new Error(`Server error: ${errorText}`);
        }
        
        // Handle streaming response
        const reader = serverResponse.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            result += chunk;
            let processedResult = marked.parse(result);  // Convert Markdown to HTML
            responseDiv.innerHTML = `<strong>Response from xAI:</strong> ${processedResult}`;  // Update in real-time
        }
        document.getElementById('questionInput').value = '';  // Clear the input field

        // Add the assistant's response to history
        history.push({
            role: 'assistant',
            content: [{ type: 'text', text: result }]
        });
        // Save back to sessionStorage
        sessionStorage.setItem('conversationHistory', JSON.stringify(history));
        // Display messages in chat area
        displayMessage('user', question);
        displayMessage('ai', result);
    } catch (error) {
        responseDiv.innerHTML = `Error: ${error.message}`;
        console.error(error);
    }
});

// New: Add event listener for Enter key on the textarea
document.getElementById('questionInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();  // Prevent adding a new line
        document.getElementById('chatForm').dispatchEvent(new Event('submit'));  // Trigger form submit
    }
    // If Shift+Enter is pressed, do nothing to allow new lines
});

window.onload = function() {
  // Detect system color scheme and set dark mode automatically
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }
  const history = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];
  history.forEach(msg => {
    // Your function to display messages
    displayMessage(msg.sender, msg.text);
  });
};