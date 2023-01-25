require("dotenv").config();

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Prepare to connection to OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on("messageCreate", async function (message) {
  try {
    // Don't respond to messages from bots
    if (message.author.bot) return;
    console.log(message.content);
    const gptResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `ChatGPT is a friendly chatbot. \n\ ChatGPT: Hello! How are you today? \n\ ${message.author.username}: ${message.content} \n\ ChatGPT:`,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n", " ChatGPT:", " ${message.author.username}:"],
    });

    message.reply(`${gptResponse.data.choices[0].text}`);
    return;
  } catch (err) {
    console.log(err);
  }
});

// Connect to the Discord API
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT bot is up and running");
