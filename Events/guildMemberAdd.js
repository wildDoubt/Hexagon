const path = require('path');
const { addUser } = require('../Utils/MongoDB');
const User = require('../Models/User');


module.exports = {
	name: path.basename(__filename).split('.')[0],
	once: false,
	execute(member) {
		const { id, username } = member.user;

		addUser(
			new User({
				user_id: id,
				username: username,
				total_playtime: 0,
				activity: [],
			}),
		).then(() => {
			console.log(`${username}님이 ${member.guild.name}에 합류했어요.`);
		});
	},
};
