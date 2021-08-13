const path = require('path');
const User = require('../Data/User');
const { getActivities } = require('../Utils');
const { recordPlaytime } = require('../Utils/MongoDB');

module.exports = {
	name: path.basename(__filename).split('.')[0],
	once: false,
	async execute(oldMember, newMember) {
		const users = new User();
		const { data } = users;
		console.log(`${newMember.user.username} [presenceUpdate] ${newMember.guild.name}`);
		// console.log('old');
		// console.log(oldMember.activities.map((v)=>v.name+new Date(v.createdTimestamp)));
		// console.log('new');
		// console.log(newMember.activities.map((v)=>v.name+new Date(v.createdTimestamp)));
		if(oldMember?.activities.length===newMember?.activities.length){
			console.log('같음')
			return;
		}

		const activities = getActivities(newMember);

		const user_id = newMember.user.id;

		const prevActivities = data.get(user_id);
		data.set(user_id, activities);

		if (prevActivities === undefined || activities === undefined) {
			console.log(newMember.user.username, ' activity undefined.');
			return;
		}
		if (!Object.prototype.hasOwnProperty.call(prevActivities, 'length')
			|| !Object.prototype.hasOwnProperty.call(activities, 'length')) {
			console.log(newMember.user.username, ' activity has no length property.');
			return;
		}

		if (prevActivities.length > activities.length) {
			console.log(`${newMember.user.username}: [Activity ended]`);
			prevActivities.filter(prevActivity => {
				return !activities
					.map(activity => activity.name)
					.find(value => value === prevActivity.name);
			})
				.forEach(endActivity => {
					const curr = new Date();
					const playtime = Math.round((curr - endActivity.start) / 1000);
					recordPlaytime(user_id, endActivity, playtime);
				});
		} else if(prevActivities.length < activities.length){
			console.log(`${newMember.user.username}: [Activity started]`);
			const temp = activities.map(activity => activity.name);
			console.log(temp);
		}
	},
};
