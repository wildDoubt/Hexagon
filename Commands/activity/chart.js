const { Command } = require('discord.js-commando');
const path = require('path');
const {
	imageToAttachment,
	getImageFromChartData,
	getChartData,
} = require('../../Utils');
const { getPlaytime } = require('../../Utils/MongoDB');

module.exports = class ChartCommand extends Command {
	constructor(client) {
		super(client, {
			name: path.basename(__filename).split('.')[0],
			group: path.basename(__dirname),
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
		});
	}

	run(message) {
		getPlaytime(message.author.id)
			.then((data) => {
				const { games, timeRecords } = getChartData(data);
				getImageFromChartData(games, timeRecords, message.author.username).then(image => {
					message.say(imageToAttachment(image));
				});
			});
	}
};
