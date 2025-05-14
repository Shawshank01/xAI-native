// server.js (or modify g.js to this)
import express, { json } from 'express';
import OpenAI from 'openai';  // Assuming you have this installed
import cors from 'cors';  // To handle CORS for browser requests
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(json());  // Parse JSON bodies
app.use(cors());  // Allow cross-origin requests (adjust for production security)

const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,  // Use environment variables for security
    baseURL: "https://api.x.ai/v1",
});

// Endpoint to handle chat requests
app.post('/ask-xai', async (req, res) => {
    const { messages } = req.body;  // Expect the messages array in the request body
    try {
        const completion = await client.chat.completions.create({
            model: "grok-3-latest",
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong with the API call' });
    }
});

// Start the server
const PORT = 3000;  // Or any port you prefer
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});