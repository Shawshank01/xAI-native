import express, { json } from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(json());
app.use(cors());

app.use(express.static(__dirname));

const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

app.post('/ask-xai', async (req, res) => {
    const { messages, model } = req.body;
    try {
        if (model && model.startsWith('grok-imagine')) {
            const prompt = messages[messages.length - 1].content[0].text;
            const imageResponse = await client.images.generate({
                model: model,
                prompt: prompt,
                n: 2 // Generate 2 images as per the curl example
            });
            res.json({ images: imageResponse.data });
        } else {
            const completion = await client.chat.completions.create({
                model: model || "grok-4.20-0309-reasoning",
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
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
