const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./logger/logger');
const { promptGenerator, postPrompt } = require('./serverUtils');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.DEV_PORT || 3001; // Get port from environment variables

app.post('/post', async (req, res, next) => {
    try {
        const { code, logs, flavor} = req.body;
        const prompt = promptGenerator(code, logs, flavor); // Generate the prompt for OpenAI
        const gptResponse = await postPrompt(prompt); // Get completion from OpenAI
        
        const response = {
            response: gptResponse,
            createdAt: new Date().toISOString()
        };
        res.json(response);
        logger.debug('OpenAI Post successful');
    } catch (error) {
        next(error);
    }   
});

app.use((err, req, res, next) => {
    logger.error(err.stack);
    const statusCode = err.response.status || 500;
    res.status(statusCode).json(errorResponse);
});

app.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});
