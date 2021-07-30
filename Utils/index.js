const {PLAYING} = require('./strings.json')

const getPlayingActivities = (user) => {
	return user.presence.activities
		.filter((value) => value.type === PLAYING)
		.map(value => {
			return {
				name: value.name,
				start: value.timestamps.start,
				end: null,
			};
		});
};

module.exports = {getPlayingActivities}
