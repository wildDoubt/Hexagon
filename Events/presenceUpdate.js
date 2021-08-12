const path = require('path');
const User = require('../Data/User');
const { getPlayingActivities } = require('../Utils');
const { recordPlaytime } = require('../Utils/MongoDB');

module.exports = {
	name: path.basename(__filename).split('.')[0],
	once: false,
	async execute(oldMember, newMember) {
		const users = new User();
		const {presenceUpdated, data} = users;
		if (presenceUpdated) {
			users.setPresenceUpdated(false);
			return;
		}
		const activities = getPlayingActivities(newMember.user);

		const user_id = newMember.user.id;

		const prevActivities = data.get(user_id);
		data.set(user_id, activities);

		if (prevActivities === undefined || activities === undefined) {
			console.log(newMember.user.username, ' activity undefined.')
			return;
		}
		if (!Object.prototype.hasOwnProperty.call(prevActivities, 'length')
			|| !Object.prototype.hasOwnProperty.call(activities, 'length')) {
			console.log(newMember.user.username, ' activity has no length property.')
			return;
		}

		if(prevActivities.length > activities.length) {
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
		} else{
			console.log(`${newMember.user.username}: [Activity started]`);
			const temp = activities.map(activity=>activity.name);
			console.log(temp);
		}
		users.setPresenceUpdated(true);
	},
};
