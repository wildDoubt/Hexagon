require('dotenv').config();
const Discord = require('discord.js');
const intents = Discord.Intents.ALL;
const client = new Discord.Client({ intents: [intents] });
const { PLAYING } = require('./Utils/strings.json');
const { CanvasRenderService } = require('chartjs-node-canvas');
const {
	findUser,
	addUser,
	recordPlaytime,
	getPlaytime,
} = require('./Utils/MongoDB');
const users = new Map();
const init = () =>{
	client.loadEvents('');
};
const initialUserState = {
	user_id: '',
	username: '',
	total_playtime: 0,
};

const plugin = {
	id: 'custom_canvas_background_color',
	beforeDraw: (chart) => {
		const ctx = chart.canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, chart.width, chart.height);
	},
};

const initializeAllUserStatus = () => {
	for (const guild of client.guilds.cache) {
		guild[1].members.cache.forEach(value => {
			const { user } = value;

			if (users.get(user.id) === undefined && !user.bot) {
				users.set(user.id, []);
				getPlayingActivities(user).forEach(activity => {
					users.get(user.id).push(
						{
							name: activity.name,
							start: activity.start,
							end: null,
						},
					);
				});
				console.log(user.username, users.get(user.id));
			}
		});
	}
};

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

const getUsers = (receivedMessage) => {
	const data = [];
	receivedMessage.guild.members.cache.forEach(value => {
		if (!value.user.bot) {
			data.push({
				...initialUserState,
				user_id: value.user.id,
				username: value.user.username,
			});
		}
	});
	return data;
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	initializeAllUserStatus();
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('pong');
	}
	else if (msg.content === 'state') {
		console.log(msg.author.id);
	}
	else if (msg.content === 'add') {
		// database에 user추가
		findUser(msg.author.id);
	}
	else if (msg.content === 'addchannel') {
		// database에 채널 생성
		// 원래는 봇이 채널에 들어가면 바로 실행해야함.

	}
	else if (msg.content === 'addalluser') {
		// 메시지 보낸 서버의 모든 유저 데이터 생성
		// 마찬가지로 봇이 채널에 들어가면 바로 실행해야함.
		addUser(getUsers(msg));
	}
	else if (msg.content === 'chart') {
		const games = [];
		const timeRecords = [];
		const width = 600;
		const height = 300;

		getPlaytime(msg.author.id)
			.then((data) => {

				data.sort((a, b) => {
					return b.playtime - a.playtime;
				});

				data.forEach(({ name, playtime }) => {
					timeRecords.push(playtime / 3600);
					games.push(name);
				});

				const canvas = new CanvasRenderService(
					width,
					height,
				);

				const configuration = {
					type: 'bar',
					data:{
						labels:games,
						backgroundColor:'white',
						datasets: [
							{
								label: 'hours',
								data: timeRecords,
								backgroundColor:'#7289d9',
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
								text: `${msg.author.username}`,
							},
						},
					},
					plugins:[plugin],
				};

				canvas.renderToBuffer(configuration).then(image=>{
					const attachment = new Discord.MessageAttachment(image);

					msg.channel.send(attachment);
				});
			});
	}
});


let presenceUpdated = false;
client.on('presenceUpdate', (oldMember, newMember) => {
	if (presenceUpdated) {
		presenceUpdated = false;
		return;
	}

	const activities = getPlayingActivities(newMember.user);

	const user_id = newMember.user.id;
	const prevActivities = users.get(user_id);
	users.set(user_id, activities);

	if(!prevActivities.hasOwnProperty(length)
		||activities.hasOwnProperty(length)){
		return;
	}

	if (prevActivities.length < activities.length) {
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
});

client.login(process.env.BOT_TOKEN);
