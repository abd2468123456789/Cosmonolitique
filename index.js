const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

client.once("ready", () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user) || message.content.startsWith("!bot")) {
    const prompt = `Réponds de façon drôle et sympa à : ${message.content}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      });

      message.reply(response.choices[0].message.content);

    } catch (error) {
      console.error(error);
      message.reply("Oups, j’ai crashé mon cerveau d’IA 😅");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
