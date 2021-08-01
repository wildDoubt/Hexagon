const { Command } = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: __filename.split('\\').slice(-1)[0].split('.')[0],
			group: __dirname.split('\\').slice(-1)[0],
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
		});
	}

	run(message){
		return message.say('Meow!');
	}
};
