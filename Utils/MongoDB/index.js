require('dotenv').config();
const { MongoClient } = require('mongodb');
const { MONGODB_USER, MONGODB_PASSWORD } = process.env;
const { DB, USER, HISTORY, GUILD } = require('../strings.json');
const History = require('../../Models/History');
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.tywvp.mongodb.net/Cluster0?retryWrites=true&w=majority`;
const client = new MongoClient(uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
const db = client.db(DB);

async function connect(func, ...args) {
	try {
		await client.connect();
		await func(...args);
	} finally {
		await client.close();
	}
}


async function findUser(user_id) {
	const collection = db.collection(USER);
	const user = await collection.findOne({ user_id: user_id });
	return user !== undefined;
}

async function addUser(user) {
	// db에 유저 데이터 생성
	const collection = db.collection(USER);
	const exist = await findUser(user.user_id);
	if (!exist) {
		const result = await collection.insertOne(user);
		console.log(
			`A document was inserted with the _id: ${result.insertedId}`,
		);
	}

}

async function recordPlaytime(user_id, activity, playtime) {
	const collection = db.collection(USER);
	console.log(user_id, activity.name, playtime);
	await recordHistory(user_id, activity.name, activity.start);
	const filter = { user_id: user_id, 'activity.name': activity.name };
	const updateDocument = {
		$inc: {
			total_playtime: playtime,
			'activity.$.playtime': playtime,
		},
	};
	const result = await collection.updateOne(filter, updateDocument);
	console.log(result);
	if (result.matchedCount === 0) {
		const createResult = await collection.updateOne({ user_id: user_id },
			{
				$push: {
					activity: {
						name: activity.name,
						playtime: playtime,
					},
				},
				$inc: {
					total_playtime: playtime,
				},
			});
		console.log(createResult);
	}
}

async function recordHistory(user_id, activity_name, start_time) {
	const collection = db.collection(HISTORY);
	// user 컬렉션에 없는 user_id가 들어오는 경우?? 일단 넣자.
	const data = new History({
		user_id: user_id,
		activity_name: activity_name,
		start_time: start_time,
	});
	const result = await collection.insertOne(data);
	console.log(
		`A document was inserted with the _id: ${result.insertedId}`,
	);
}

async function addChannel(channel_id) {
	const collection = db.collection(GUILD);
	const channel = await collection.findOne({ channel_id: channel_id });
	// 채널이 존재하지 않으면 추가
	// 개인 플레이타임 기능 완성되면 구현
}

function getPlaytime(user_id) {
	return new Promise((resolve, reject) => {
		let data;
		client.connect()
			.then(() =>
				db.collection(USER).findOne({
					user_id: user_id,
				}),
			)
			.then(document => {
				data = document.activity;
			})
			.catch(error => {
				reject(Error(error));
			})
			.finally(() => {
				client.close().then(() => {
					resolve(data);
				});
			});
	});
}

module.exports = {
	findUser: async (user_id) => await connect(findUser, user_id),
	addChannel: async (channel_id) => await connect(addChannel, channel_id),
	addUser: async (user_data) => await connect(addUser, user_data),
	recordPlaytime: async (user_id, activity, playtime) => await connect(recordPlaytime, user_id, activity, playtime),
	getPlaytime,
};
