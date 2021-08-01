const { Command } = require('discord.js-commando');
const path = require('path');

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: path.basename(__filename).split('.')[0],
			group: path.basename(__dirname),
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
		});
	}

	run(message){
		return message.say('Meow!');
	}
};
