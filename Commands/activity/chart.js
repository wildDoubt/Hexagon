const { imageToAttachment } = require('../../Utils');
const { getImageFromChartData } = require('../../Utils');
const { getChartData } = require('../../Utils');
const { sendImageToChannel } = require('../../Utils');
const { getPlaytime } = require('../../Utils/MongoDB');
const { Command } = require('discord.js-commando');

module.exports = class ChartCommand extends Command {
	constructor(client) {
		super(client, {
			name: __filename.split('\\').slice(-1)[0].split('.')[0],
			group: __dirname.split('\\').slice(-1)[0],
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
		});
	}

	run(message, args, fromPattern, result){
		getPlaytime(message.author.id)
			.then((data) => {
				// data = [{
				// 	name: activity_name,
				// 	playtime: playtime
				// }...]

				const {games, timeRecords} = getChartData(data);// 두 배열 리턴
				getImageFromChartData(games, timeRecords, message.author.username).then(image=>{
					message.say(imageToAttachment(image))
				})
			});
	}
};
