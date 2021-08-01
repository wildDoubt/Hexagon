const path = require('path');
const { addUser } = require('../Utils/MongoDB');

const initialUserState = {
	user_id: '',
	username: '',
	total_playtime: 0,
	activity: [],
};

module.exports = {
	name: path.basename(__filename).split('.')[0],
	once: false,
	execute(member) {
		const { id, username } = member.user;
		addUser([{
			...initialUserState,
			user_id:id,
			username:username,
		}]).then(()=>{
			console.log(`${username}님이 ${member.guild.name}에 합류했어요.`);
		});
	},
};
