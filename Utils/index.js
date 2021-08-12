const Discord = require('discord.js');
const { CanvasRenderService } = require('chartjs-node-canvas');
const { PLAYING } = require('./strings.json');
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
				start: value.timestamps.start,
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
	const canvas = new CanvasRenderService(
		600,
		300,
	);
	const plugin = {
		id: 'custom_canvas_background_color',
		beforeDraw: (chart) => {
			const ctx = chart.canvas.getContext('2d');
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
};
