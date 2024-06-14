const Discord = require('discord.js');
const { GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();
require('dotenv').config();

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ]
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

async function getActivity(userId) {
  return new Promise((resolve, reject) => {
    client.guilds.cache.forEach(async (guild) => {
      const member = await guild.members.fetch(userId);
      if (member) {
        resolve(member.presence.activities);
      } else {
        reject(new Error('User not found'));
      }
    });
  });
}

app.get('/activity/:userId', async (req, res) => {
  try {
    const activity = await getActivity(req.params.userId);
    res.json(activity);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at ${port}`);
});

