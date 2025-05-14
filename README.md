

# xAI Chat Interface Project

## Description

This is a simple web application that allows users to chat with xAI's API (e.g., Grok) by submitting questions through a form. The app sends requests to a local server, processes responses, and displays them on the page with Markdown formatting for better readability.

It's built using **HTML, CSS, and JavaScript** for the frontend, and **Node.js with Express** for the backend server.

This project was developed to demonstrate a basic chat interface, including features like expanded input areas, auto-clearing messages, Enter key submission, **dark mode (auto and manual switch)**, **chat bubbles for dialog history**, and **persistent conversation context**. It's intended for educational or personal use, assuming you have access to xAI's API.

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

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
XAI_API_KEY=your_xai_api_key_here
```

Replace `your_xai_api_key_here` with your actual API key.

---

## Usage

### 1. Start the Server

```bash
node gserver.js
```

This will start a local server at: `http://localhost:3000`.

### 2. Open the App

Open `index.html` in your browser.

If you encounter CORS issues, make sure the server is running.

### 3. Interact with the App

- Type a question in the textarea.
- Press **Enter** or click **Send** to submit.
- See responses rendered with Markdown formatting below.
- **Switch between light and dark mode** using the "Switch Theme" button, or let the app follow your system's default theme automatically.
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
- **Chat Bubbles/Dialog Boxes**: User and AI messages are shown in visually distinct dialog bubbles for easy reading.
- **Persistent Conversation Context**: The conversation history is stored in your browser session and sent to the AI for context-aware responses.
- **Clean Code Structure**: All JavaScript is in `script.js` (no inline scripts in HTML).

---

## File Structure

```
├── index.html        # Main HTML UI
├── styles.css        # Styling for the chat interface
├── script.js         # Frontend logic (submission, rendering, theme, etc.)
├── gserver.js        # Node.js backend server
├── package.json      # Project metadata and dependencies
├── package-lock.json # Dependency lock file
├── .env              # API keys (should be create by yourself before run)
```

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

Thanks to **xAI** for their API and inspiration!