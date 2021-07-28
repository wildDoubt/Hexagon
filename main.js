require('dotenv').config();
const Discord = require('discord.js');
const {insert, findUser, addUser, recordPlaytime} = require('./plugins/MongoDB');
const intents = Discord.Intents.ALL;
const client = new Discord.Client({intents: [intents]});

const PLAYING = 'PLAYING';


const initialUserState = {
    user_id: '',
    username: '',
    total_playtime: 0,
}

let users = new Map();

const endActivity = (user_id, activities) => {
    return users.get(user_id).length > activities.length
    // console.log(users.get(user_id))
    // console.log(activities)
    // users.get(user_id).forEach(({name})=>{
    //
    // })
}

const getUsers = (receivedMessage) => {
    let data = [];
    receivedMessage.guild.members.cache.forEach(value => {
        if (!value.user.bot) {
            data.push({
                ...initialUserState,
                user_id: value.user.id,
                username: value.user.username,
            })
        }
    });
    return data;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    for (let guild of client.guilds.cache) {
        guild[1].members.cache.forEach(value => {
            if (!value.user.bot) {
                users.set(value.user.id, []);
            }
        })
    }
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    } else if (msg.content === 'insert') {
        insert();
    } else if (msg.content === 'state') {
        console.log(msg.author.id)
    } else if (msg.content === 'add') {
        // database에 user추가
        findUser(msg.author.id);
    } else if (msg.content === 'addchannel') {
        // database에 채널 생성
        // 원래는 봇이 채널에 들어가면 바로 실행해야함.

    } else if (msg.content === 'addalluser') {
        // 메시지 보낸 서버의 모든 유저 데이터 생성
        // 마찬가지로 봇이 채널에 들어가면 바로 실행해야함.
        addUser(getUsers(msg));
    } else if(msg.content==='test'){
        recordPlaytime('316068755073400842','7 Billion Humans', 5)
    }
});


let presenceUpdated = false;
client.on('presenceUpdate', (oldMember, newMember) => {
    if (presenceUpdated) {
        presenceUpdated = false;
        return;
    }

    const activities = newMember.user.presence.activities
        .filter((value) => value.type === PLAYING)
        .map(value => {
            return {
                name: value.name,
                start: value.timestamps.start,
            }
        });
    const user_id = newMember.user.id;
    // endActivity(user_id, activities);
    // console.log(endActivity(user_id, activities))
    if (!endActivity(user_id, activities)) {
        presenceUpdated = true;
        console.log(activities)
        newMember.user.presence.activities.forEach(activity => {
            if (activities.map((value) => value.name).find(value => {
                return value === activity.name;
            })) {
                if (users
                    .get(user_id)
                    .filter((value) => {
                        return value.name === activities[0].name
                    })
                    .length===0) {
                    users.get(user_id).push({
                        name: activities[0].name,
                        start: activities[0].start,
                        end: null,
                    })
                } else {
                    users.get(user_id).forEach(value=>{
                        if(value.name===activities[0].name){
                            value.start = activities[0].start
                        }
                    })
                }
                console.log('users' + users.get(user_id))
            }
        })
    } else {
        users.get(user_id).forEach(activity => {
            if(activity.end===null) {
                const curr = new Date();
                activity.end = curr;
                const playtime = Math.round((curr - activity.start) / 1000);
                console.log(activity.name, playtime);
                recordPlaytime(user_id, activity.name, playtime);
            }
        })
        presenceUpdated = true;
    }
})

client.login(process.env.BOT_TOKEN);
