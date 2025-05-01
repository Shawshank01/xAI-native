document.getElementById('chatForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent form reload
    
    const question = document.getElementById('questionInput').value;  // Get the user's input
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = 'Loading...';  // Show loading state
    
    try {
        const serverResponse = await fetch('http://localhost:3000/ask-xai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question }),
        });
        
        if (!serverResponse.ok) {
            throw new Error('Server error');
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