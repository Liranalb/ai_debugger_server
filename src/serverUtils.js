const { Configuration, OpenAIApi } = require("openai");
const prompt_config = require("./config/prompt_config.json"); // Load OpenAI configuration
const gpt_config = require("./config/gpt_config.json");
// generates the prompt for OpenAI based on code and logs
const promptGenerator = (code, logs, flavor) => {
    if (!code || !logs) throw new Error("Code or Logs cannot be empty!");
    const promptValue = prompt_config.CODE_FLAVOR[flavor]?.prompt || '';
    
    // Concatenate prompts from configuration string and user inputs
    return promptValue.concat(
        prompt_config.PRE_CODE_PROMPT,
        code,
        prompt_config.PRE_LOG_PROMPT,
        logs
    );
};

// Send a prompt to OpenAI and get a completion
const postPrompt = async (prompt) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Get API key from environment variables
    });
    const openai = new OpenAIApi(configuration);

    // Create a chat completion request to OpenAI API
    const response = await openai.createChatCompletion({
        model: gpt_config.MODEL,
        messages: [{"role":gpt_config.ROLE,"content":prompt}],
        temperature: gpt_config.TEMPERATURE,
        max_tokens: gpt_config.MAX_TOKENS,
        top_p: gpt_config.TOP_P,
        frequency_penalty: gpt_config.FREQUENCY_PENALTY,
        presence_penalty: gpt_config.PRESENCE_PENALTY,
    });

    return response.data.choices[0].message.content;
};

module.exports = {
    promptGenerator,
    postPrompt,
};
