require('dotenv').config();
const {MongoClient} = require('mongodb');
const {MONGODB_USER, MONGODB_PASSWORD} = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.tywvp.mongodb.net/Cluster0?retryWrites=true&w=majority`;
const client = new MongoClient(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = client.db("MyDB");

async function connect(func, ...args) {
    try {
        await client.connect();
        await func(...args);
    } finally {
        await client.close();
    }
}

async function insert() {
    const collection = db.collection("test");
    const data = {
        name: '최원영',
        age: 24,
        createdAt: new Date(),
    };
    await collection.insertOne(data);
    console.log("DONE!");
}


async function findUser(user_id) {
    const collection = db.collection("USER");
    const user = await collection.findOne({user_id: user_id});
    return user !== undefined;
}

async function addUser(user_data) {
    const collection = db.collection("USER");
    for (let user of user_data) {
        const exist = await findUser(user.user_id);
        if (!exist) {
            const result = await collection.insertOne(user);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`,
            )
        }
    }
}

async function recordPlaytime(user_id, activity, playtime) {
    const collection = db.collection("USER");
    console.log(user_id, activity, playtime)
    const filter = {user_id: user_id, "activity.name": activity};
    const updateDocument = {
        $inc: {
            total_playtime: playtime,
            "activity.$.playtime": playtime
        },
    }
    const result = await collection.updateOne(filter, updateDocument);
    console.log(result)
    if (result.matchedCount === 0) {
        const createResult = await collection.updateOne({user_id: user_id},
            {
                $push: {
                    activity: {
                        name: activity,
                        playtime: playtime,
                    }
                },
                $inc: {
                    total_playtime: playtime
                },
            })
        console.log(createResult);
    }
}

async function addChannel(channel_id) {
    const collection = db.collection("CHANNEL");
    const channel = await collection.findOne({channel_id: channel_id});
    // 채널이 존재하지 않으면 추가
    // 개인 플레이타임 기능 완성되면 구현
}

module.exports = {
    insert: async () => await connect(insert),
    findUser: async (user_id) => await connect(findUser, user_id),
    addChannel: async (channel_id) => await connect(addChannel, channel_id),
    addUser: async (user_data) => await connect(addUser, user_data),
    recordPlaytime: async (user_id, activity, playtime) => await connect(recordPlaytime, user_id, activity, playtime),
};
