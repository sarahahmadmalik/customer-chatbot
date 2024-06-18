import express from 'express';
import bodyParser from 'body-parser';
import dialogflow from 'dialogflow';
import cors from 'cors';
import dotenv from 'dotenv';
// import { v4 } from 'uuid';

dotenv.config();

const { json } = bodyParser;
const { SessionsClient } = dialogflow;

const app = express();

app.use(json());
app.use(cors({origin: ["https://customer-chatbot-7mg229s1l-sara-ahmad-maliks-projects.vercel.app"], methods: ["GET", "POST"], credentials: true}));

const projectId = process.env.PROJECT_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
// const sessionId = v4()
const sessionClient = new SessionsClient({ keyFilename: credentialsPath });

app.get("/", (req, res) => res.json("Express on Vercel"));

app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    try {
        const sessionPath = sessionClient.sessionPath(projectId, "");
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'en-US',
                },
            },
        };

        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;

        res.json({ fulfillmentText: result.fulfillmentText });
    } catch (error) {
        console.error('Error sending message to Dialogflow:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});


