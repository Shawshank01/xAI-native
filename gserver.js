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
    const { question } = req.body;  // Expect the question in the request body
    
    try {
        const completion = await client.chat.completions.create({
            model: "grok-3-latest",
            messages: [
                {
                    role: "system",
                    content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
                },
                {
                    role: "user",
                    content: question,  // Use the question from the webpage
                },
            ],
            stream: true,  // Keep streaming if needed
        });
        
        // Handle streaming response
        res.setHeader('Content-Type', 'text/plain');  // Or adjust as needed
        for await (const chunk of completion) {
            if (chunk.choices[0]?.delta?.content) {
                res.write(chunk.choices[0].delta.content);  // Stream back to the client
            }
        }
        res.end();  // End the response
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