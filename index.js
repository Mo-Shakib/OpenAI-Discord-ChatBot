require("dotenv").config();
const ask = require("./openai.js").ask;
//import the "ask" function from the "ai.js" file
const { Client, Events, GatewayIntentBits } = require("discord.js"); //v14.6.0

// Get the token from the .env file
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(
    `\n-> OpenAI Bot is up and running! Logged in as ${c.user.tag} on ${c.guilds.cache.size} servers.\n \n\tDeveloped by: Mohammad Shakib (https://mo-shakib.github.io) \n\tPowered by OpenAI (https://openai.com)\n`
  );
});

client.on(Events.MessageCreate, async (message) => {
  if (message.content.substring(0, 1) === ">") {
    const prompt = message.content.substring(1); //remove the exclamation mark from the message
    const answer = await ask(prompt); //prompt GPT-3
    client.channels
      .fetch(message.channelId)
      .then((channel) => channel.send(answer));

    console.log(new Date().toLocaleString());
    console.log(`\n[*] ${message.author.username} asked: ${prompt} \n[=] OpenAI Bot answered: ${answer}\n`);
  }
});

// Log in to Discord with your client's token
client.login(token);
