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

document.getElementById('chatForm').addEventListener('submit', async function (event) {
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

        // Handle response based on model
        if (currentModel === 'grok-2-image') {
            // Handle image generation response (non-streaming JSON)
            const responseData = await serverResponse.json();
            let result = '';
            if (responseData.images && responseData.images.length > 0) {
                result = 'Generated Images:\n';
                responseData.images.forEach((img, index) => {
                    result += `Image ${index + 1}: <img src="${img.url}" alt="Generated Image ${index + 1}" style="max-width: 100%; height: auto;"><br>`;
                });
            } else {
                result = 'No images generated. Response: ' + JSON.stringify(responseData);
            }
            responseDiv.innerHTML = `<strong>Response from xAI:</strong> ${result}`;
            // Add the assistant's response to history
            history.push({
                role: 'assistant',
                content: [{ type: 'text', text: result }]
            });
            // Display messages in chat area
            displayMessage('user', question);
            displayMessage('ai', result);
        } else {
            // Handle streaming response for text
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
            // Add the assistant's response to history
            history.push({
                role: 'assistant',
                content: [{ type: 'text', text: result }]
            });
            // Display messages in chat area
            displayMessage('user', question);
            displayMessage('ai', result);
        }

        document.getElementById('questionInput').value = '';  // Clear the input field
        // Save back to sessionStorage
        sessionStorage.setItem('conversationHistory', JSON.stringify(history));
    } catch (error) {
        responseDiv.innerHTML = `Error: ${error.message}`;
        console.error(error);
    }
});

// New: Add event listener for Enter key on the textarea
document.getElementById('questionInput').addEventListener('keydown', function (event) {
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
    bubble.innerHTML = text; // Use innerHTML to render image tags
    msgDiv.appendChild(label);
    msgDiv.appendChild(bubble);
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Dark mode toggle button logic
window.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.onclick = function () {
            document.body.classList.toggle('dark-mode');
        };
    }
    // Model toggle logic
    const modelToggle = document.getElementById('modelToggle');
    const imageModelToggle = document.getElementById('imageModelToggle');
    const modelHint = document.getElementById('modelHint');
    const questionInput = document.getElementById('questionInput');
    if (modelToggle && imageModelToggle && modelHint && questionInput) {
        // Set initial hint
        modelHint.textContent = currentModel === 'grok-3-latest' ? 'Current model: Grok-3' : currentModel === 'grok-3-mini-latest' ? 'Current model: Grok-3 Mini' : 'Current model: Grok-2 Image';

        modelToggle.onclick = function () {
            console.log('Text Model Button clicked!');
            if (currentModel === 'grok-3-latest') {
                currentModel = 'grok-3-mini-latest';
                modelToggle.classList.add('active');
                imageModelToggle.classList.remove('active');
            } else {
                currentModel = 'grok-3-latest';
                modelToggle.classList.remove('active');
                imageModelToggle.classList.remove('active');
            }
            modelToggle.textContent = 'Thinking';
            modelHint.textContent = currentModel === 'grok-3-latest' ? 'Current model: Grok-3' : 'Current model: Grok-3 Mini';
            questionInput.placeholder = 'e.g., What\'s the meaning of life?';
        };

        imageModelToggle.onclick = function () {
            console.log('Image Model Button clicked!');
            currentModel = 'grok-2-image';
            imageModelToggle.classList.add('active');
            modelToggle.classList.remove('active');
            modelHint.textContent = 'Current model: Grok-2 Image';
            questionInput.placeholder = 'e.g., A view in space';
        };
    }
    // Display chat history
    const history = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];
    history.forEach(msg => {
        displayMessage(msg.sender, msg.text);
    });
});