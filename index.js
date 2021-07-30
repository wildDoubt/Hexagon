require('dotenv').config();
const Discord = require('discord.js');
const Client = require('./Client');

const client = new Client({
	commandPrefix: '!',
	owner: process.env.OWNER_ID, // 관리자 아이디
	ws: { intents: Discord.Intents.ALL },
});


client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('Refactoring...');
	client.loadCommands();
	client.loadUserStates();
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN)


