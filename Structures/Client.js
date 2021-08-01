require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { getPlayingActivities } = require('../Utils');

class Client extends CommandoClient {
	constructor(config, options) {
		super(options);
		this.userManager = new Map();
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

	loadUserStates() {
		for (const guild of this.guilds.cache) {
			guild[1].members.cache.forEach(value => {
				const { user } = value;
				if (this.userManager.get(user.id) === undefined && !user.bot) {
					this.userManager.set(user.id, []);
					getPlayingActivities(user).forEach(activity => {
						this.userManager.get(user.id).push(
							{
								name: activity.name,
								start: activity.start,
								end: null,
							},
						);
					});
					console.log(user.username, this.userManager.get(user.id));
				}
			});
		}
	}
}

module.exports = Client;
