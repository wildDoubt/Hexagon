const path = require('path');
const { getPlayingActivities } = require('../Utils');
const { recordPlaytime } = require('../Utils/MongoDB');

const users = new Map();
let presenceUpdated = false;

module.exports = {
	name: path.basename(__filename).split('.')[0],
	once: false,
	execute(oldMember, newMember){
		if (presenceUpdated) {
			presenceUpdated = false;
			return;
		}

		const activities = getPlayingActivities(newMember.user);

		const user_id = newMember.user.id;
		const prevActivities = users.get(user_id);
		users.set(user_id, activities);

		if(!prevActivities?.hasOwnProperty('length')
			||!activities?.hasOwnProperty('length')){
			return;
		}

		if (prevActivities.length <= activities.length) {
			presenceUpdated = true;
			activities.filter(activity => {
				return !prevActivities
					.map(prevActivity => prevActivity.name)
					.find(value => value === activity.name);
			})
				.forEach(value => {
					console.log(value);
				});
		}
		else {
			console.log(newMember.user.username, 'end activity');
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
			presenceUpdated = true;
		}
	}
}
