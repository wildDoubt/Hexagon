require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { getPlayingActivities } = require('./Utils');
const User = require('./Data/User');

class Client extends CommandoClient {
	constructor(config, options) {
		super(options);
		this.userManger = new User();
	}

	loadCommands() {
		this.registry
			.registerDefaultTypes()
			.registerGroups([
				['debug', 'Debug Command Group'],
				['activity', 'Activity Command Group'],
			])
			.registerDefaultGroups()
			.registerDefaultCommands()
			.registerCommandsIn(path.join(__dirname, 'Commands'));
	}

	async loadUserStates() {
		for (const guild of this.guilds.cache) {
			guild[1].members.cache.forEach(value => {
				const { user } = value;
				const { data } = this.userManger;
				if (data.get(user.id) === undefined && !user.bot) {
					data.set(user.id, []);
					getPlayingActivities(user).forEach(activity => {
						data.get(user.id).push(
							{
								name: activity.name,
								start: activity.start,
								end: null,
							},
						);
					});
					console.log(user.username, data.get(user.id));
				}
			});
		}
	}
}

module.exports = Client;
