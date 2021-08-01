require('dotenv').config();
const Discord = require('discord.js');
const Client = require('./Client');
const fs = require('fs');

const client = new Client({
	commandPrefix: '!',
	owner: process.env.OWNER_ID,
	ws: { intents: Discord.Intents.ALL },
});

const eventFiles = fs.readdirSync('./Events').filter(file => file.endsWith('js'));

eventFiles.forEach(file => {
	const event = require(`./Events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);

