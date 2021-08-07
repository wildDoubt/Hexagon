const path = require('path');

module.exports = {
	name: path.basename(__filename).split('.')[0],
	once: true,
	execute(client) {
		console.log(`Logged in as ${client.user.tag}!`);
		// client.user.setActivity('Refactoring...');
		client.loadCommands();
		client.loadUserStates();
	},
};
