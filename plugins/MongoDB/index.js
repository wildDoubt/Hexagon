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
    const user = await collection.findOne({user_id:user_id});
    if(user){
        console.log(user);
    }
}

module.exports = {
    insert: async () => await connect(insert),
    findUser: async (user_id) => await connect(findUser, user_id)
};
