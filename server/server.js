import express from 'express';
import bodyParser from 'body-parser';
import dialogflow from 'dialogflow';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

dotenv.config();

const { json } = bodyParser;
const { SessionsClient } = dialogflow;

const app = express();
const port = process.env.PORT || 5000;

app.use(json());
app.use(cors());

const projectId = process.env.PROJECT_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const sessionId = v4()
const sessionClient = new SessionsClient({ keyFilename: credentialsPath });

app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    try {
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
