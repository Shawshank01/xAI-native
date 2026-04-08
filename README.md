# xAI Chat Interface Project

## Description

This is a local, user-friendly web application that provides a graphical interface for chatting with xAI's latest models via their official API. Designed for a seamless experience, this tool allows for rich communication with Grok using a simple text interface, full Markdown-rendered streaming responses, and advanced image generation capabilities.

The frontend is built with **HTML, CSS, and JavaScript**, while the backend uses **Node.js with Express** to securely handle API requests and manage conversation context.

---

## Features

- **Latest xAI Models**: Support for the entire new lineup, including:
  - **Language**: `grok-4.20-0309-reasoning`, `non-reasoning`, `multi-agent-0309`, and fast variants.
  - **Image**: `grok-imagine-image-pro` and `grok-imagine-image`.
- **Model Selection Dropdowns**: Easily switch between language and image models with clean dropdown menus. 
- **Clear Chat**: A dedicated button to wipe your local session history and start fresh instantly.
- **Rich Streaming Response**: AI responses stream directly into the chat bubbles in real-time with Markdown parsing.
- **Smart UI Logic**: Selecting an image model automatically resets the language model dropdown to prevent confusion.
- **Dark Mode**: Automatically follows your system's default theme or can be toggled manually.
- **Persistent Context**: Full conversation history is preserved during your session for context-aware responses.

---

## Prerequisites

- **Node.js and npm**: Version 18 or higher.
- **xAI API Key**: Sign up at [xAI Console](https://console.x.ai/).
- **Browser**: Tested with Brave, Firefox, and Safari.

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

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
XAI_API_KEY=your_xai_api_key_here
```

---

## Usage

### 1. Start the App
Run the following command:
```bash
npm start
```
This command opens the UI in your default browser and starts the Node server in the foreground.

### 2. Stop the App
Simply press **`Ctrl + C`** in your terminal. This will safely stop the Node server.

### 3. Troubleshooting "Ghost" Servers
If you get a `400` or `Port in use` error, it likely means a server process is stuck in the background. To clear it:
```bash
lsof -ti :3000 | xargs kill -9
```

---

## Acknowledgements

- [Express](https://expressjs.com/) — Backend server
- [OpenAI SDK](https://www.npmjs.com/package/openai) — Utilizes xAI's compatibility layer
- [Marked](https://github.com/markedjs/marked) — Markdown parsing
