const Discord = require('discord.js');
const { PLAYING } = require('./strings.json');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const isUserInGuild = (userId, guildMembers) => {
	for (const memberId of guildMembers) {
		if (memberId === userId) return true;
	}
	return false;
};


/**
 *
 * @param user
 * @returns {{name: string, start: Date, end: null}[]}
 */
const getPlayingActivities = (user) => {
	return user.presence.activities
		.filter((value) => value.type === PLAYING)
		.map(value => {
			return {
				name: value.name,
				start: new Date(value.createdTimestamp),
				end: null,
			};
		});
};

const getActivities = (user) => {
	return user.activities
		.filter((value) => value.type === PLAYING)
		.map(value => {
			return {
				name: value.name,
				start: new Date(value.createdTimestamp),
				end: null,
			};
		});
};

const imageToAttachment = (image) => new Discord.MessageAttachment(image);

/**
 *
 * @param {[{name:String, playtime:Number}]} data
 * @returns {{games: [], timeRecords: []}}
 */
const getChartData = (data) => {
	const games = [];
	const timeRecords = [];

	data.sort((a, b) => {
		return b.playtime - a.playtime;
	});

	data.forEach(({ name, playtime }) => {
		timeRecords.push(playtime / 3600);
		games.push(name);
	});

	return {
		games,
		timeRecords,
	};
};

/**
 *
 * @param colData
 * @param rowData
 * @param username
 * @returns {Promise<Buffer>}
 */
const getImageFromChartData = async (colData, rowData, username) => {
	console.log('username: ' + username);
	const canvas = new ChartJSNodeCanvas({
		width: 600, height: 300});
	canvas.registerFont('assets/Nanum_Gothic/NanumGothic-Regular.ttf', { family: 'NanumGothic' });
	const plugin = {
		id: 'custom_canvas_background_color',
		beforeDraw: (chart) => {
			const ctx = chart.canvas.getContext('2d');
			ctx.font = "20px 'NanumGothic'";
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, chart.width, chart.height);
		},
	};

	const configuration = {
		type: 'bar',
		data: {
			labels: colData,
			backgroundColor: 'white',
			datasets: [
				{
					label: 'hours',
					data: rowData,
					backgroundColor: '#7289d9',
				},
			],
		},
		options: {
			indexAxis: 'y',
			elements: {
				bar: {
					borderWidth: 2,
				},
			},
			responsive: true,
			plugins: {
				legend: {
					position: 'right',
				},
				title: {
					display: true,
					text: username,
				},
			},
		},
		plugins: [plugin],
	};
	return await canvas.renderToBuffer(configuration);
};

module.exports = {
	getPlayingActivities,
	imageToAttachment,
	getChartData,
	getImageFromChartData,
	isUserInGuild,
	getActivities,
};
