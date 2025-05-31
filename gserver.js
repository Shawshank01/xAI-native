// server.js (or modify g.js to this)
import express, { json } from 'express';
import OpenAI from 'openai';  // Pre-installation is required
import cors from 'cors';  // To handle CORS for browser requests
import dotenv from 'dotenv';
import path from 'path';  // Add path module to serve static files
import { fileURLToPath } from 'url';  // For ES module compatibility

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(json());  // Parse JSON bodies
app.use(cors());  // Allow cross-origin requests (adjust for production security)

// Serve static files from the root directory
app.use(express.static(__dirname));

const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,  // Use environment variables for security
    baseURL: "https://api.x.ai/v1",
});

// Endpoint to handle chat requests and image generation
app.post('/ask-xai', async (req, res) => {
    const { messages, model } = req.body;  // Expect the messages array and model in the request body
    try {
        if (model === 'grok-2-image') {
            // Handle image generation request using the correct endpoint
            const prompt = messages[messages.length - 1].content[0].text; // Use the latest user message as the prompt
            const imageResponse = await client.images.generate({
                model: "grok-2-image",
                prompt: prompt,
                n: 2 // Generate 2 images as per the curl example
            });
            res.json({ images: imageResponse.data });
        } else {
            // Handle chat request
            const completion = await client.chat.completions.create({
                model: model || "grok-3-latest",
                messages: messages,  // Forward the full conversation history
                stream: true,
            });
            // Handle streaming response
            res.setHeader('Content-Type', 'text/plain');
            for await (const chunk of completion) {
                if (chunk.choices[0]?.delta?.content) {
                    res.write(chunk.choices[0].delta.content);
                }
            }
            res.end();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong with the API call', details: error.message });
    }
});

// Start the server
const PORT = 3000;  // Or any port you prefer
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});