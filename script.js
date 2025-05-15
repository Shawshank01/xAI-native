// Detect system color scheme and set dark mode as early as possible
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}
// Listen for system color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

let currentModel = 'grok-3-latest';

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
        // Send the full history and model to the backend
        const serverResponse = await fetch('http://localhost:3000/ask-xai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: history, model: currentModel }),
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

// Display a chat message as a dialog bubble
function displayMessage(sender, text) {
    const chat = document.getElementById('chat');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (sender === 'user' ? 'user' : 'ai');
    // Add sender label for accessibility
    const label = document.createElement('div');
    label.style.fontSize = '12px';
    label.style.marginBottom = '2px';
    label.style.opacity = '0.7';
    label.textContent = (sender === 'user' ? 'You' : 'AI');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    msgDiv.appendChild(label);
    msgDiv.appendChild(bubble);
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Dark mode toggle button logic
window.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.onclick = function() {
            document.body.classList.toggle('dark-mode');
        };
    }
    // Model toggle logic
    const modelToggle = document.getElementById('modelToggle');
    const modelHint = document.getElementById('modelHint');
    if (modelToggle && modelHint) {
        // Set initial hint
        modelHint.textContent = currentModel === 'grok-3-latest' ? 'Current model: Grok-3' : 'Current model: Grok-3 Mini';
        modelToggle.onclick = function() {
            console.log('Button clicked!'); // Debug log
            if (currentModel === 'grok-3-latest') {
                currentModel = 'grok-3-mini-latest';
                modelToggle.classList.add('active'); // Keep active color for mini model
            } else {
                currentModel = 'grok-3-latest';
                modelToggle.classList.remove('active'); // Remove active color for main model
            }
            modelToggle.textContent = 'Thinking';
            modelHint.textContent = currentModel === 'grok-3-latest' ? 'Current model: Grok-3' : 'Current model: Grok-3 Mini';
        };
    }
    // Display chat history
    const history = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];
    history.forEach(msg => {
        displayMessage(msg.sender, msg.text);
    });
});