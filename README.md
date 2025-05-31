# xAI Chat Interface Project

## Description

This is a local, user-friendly web application that provides a graphical interface for chatting with Grok AI via xAI's cloud API. Designed for users who prefer not to interact through code, terminal commands, or scripts, this tool allows seamless communication with Grok using a simple text input and rich Markdown-rendered responses.

The frontend is built with **HTML, CSS, and JavaScript**, while the backend uses **Node.js with Express** to securely handle API requests and manage conversation context.

This project was developed to demonstrate a basic chat interface, including features like expanded input areas, auto-clearing messages, Enter key submission, **dark mode (auto and manual switch)**, **chat bubbles for dialog history**, **persistent conversation context**, and **image generation**.

---

## Prerequisites

Before you get started, ensure you have the following:

- **Node.js and npm**: Version 14 or higher.
- **xAI API Key**: Sign up at [xAI](https://x.ai) if you haven't already.
- **Code Editor**: e.g., VS Code.
- **Browser**: Tested with Brave, but should work with Chrome or Firefox.
- **Dependencies**: Express, OpenAI, CORS, dotenv, Marked, etc.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shawshank01/xAI-native.git
cd xAI-native
```

### 2. Install Dependencies

```bash
npm install
```

This will install:

- `express`: For the backend server.
- `openai`: For interacting with the xAI API.
- `cors`: For cross-origin requests.
- `dotenv`: For managing environment variables.
- `marked`: For Markdown parsing.
- `open`: For automatically opening the browser on startup.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
XAI_API_KEY=your_xai_api_key_here
```

Replace `your_xai_api_key_here` with your actual API key.

---

## Usage

### 1. Start the App

Run the following command to start the server and automatically open the app in your default browser:

```bash
npm start
```

This will start a local server at `http://localhost:3000` and open `http://localhost:3000/index.html` in your browser.

If the browser does not open automatically, manually navigate to `http://localhost:3000/index.html` after the server starts.

### 2. Interact with the App

- Type a question in the textarea.
- Press **Enter** or click **Send** to submit.
- See responses rendered with Markdown formatting below.
- **Switch between light and dark mode** using the "Switch Theme" button, or let the app follow your system's default theme automatically.
- **Switch between Grok-3 and Grok-3 Mini models** using the "Thinking" button above the input. The current model is shown as a hint below the button.
- **Switch to Grok-2 Image model** using the "Image Generation" button to generate images based on your prompt (e.g., "A view in space"). Generated images will be displayed in the response area.
- **All conversation history is shown as dialog bubbles** for improved readability.
- **Context is preserved**: The AI will remember previous messages in the session until you close the browser tab.

---

## Features

- **User-Friendly Interface**: Responsive layout with a styled input area and result display.
- **Markdown Rendering**: Uses `marked` to parse and render formatted responses.
- **Streaming Support**: Displays API responses in real-time.
- **Error Handling**: Friendly error messages for network or API issues.
- **Secure Key Management**: Uses `.env` to protect your API key.
- **Dark Mode**: Automatically detects your system's color scheme and applies dark or light mode. You can also manually switch themes with the "Switch Theme" button.
- **Model Switching**: Use the "Thinking" button to toggle between Grok-3 and Grok-3 Mini models. The button stays highlighted when Grok-3 Mini is active, and a hint below the button shows the current model.
- **Image Generation**: Use the "Image Generation" button to switch to the Grok-2 Image model for generating images based on your text prompt. Images are displayed in the chat.
- **Chat Bubbles/Dialog Boxes**: User and AI messages are shown in visually distinct dialog bubbles for easy reading.
- **Persistent Conversation Context**: The conversation history is stored in your browser session and sent to the AI for context-aware responses.
- **Clean Code Structure**: All JavaScript is in `script.js` (no inline scripts in HTML).
- **Simplified Startup**: Run `npm start` to launch the server and open the app in your browser with a single command.

---

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and commit:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Submit a pull request.

Please follow best practices and ensure cross-browser compatibility and secure code.

---

## Acknowledgements

This project uses open-source libraries:

- [Express](https://expressjs.com/) — Backend server
- [OpenAI SDK](https://www.npmjs.com/package/openai) — Adapted for xAI use
- [Marked](https://github.com/markedjs/marked) — Markdown parsing
- [Open](https://www.npmjs.com/package/open) — For automatic browser opening

Thanks to **xAI** for their API and inspiration!