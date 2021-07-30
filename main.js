require('dotenv').config();
const Discord = require('discord.js');
const {
    findUser,
    addUser,
    recordPlaytime,
} = require('./Utils/MongoDB');
const intents = Discord.Intents.ALL;
const client = new Discord.Client({intents: [intents]});
const {PLAYING} = require('./Utils/strings.json');

let users = new Map();

const initialUserState = {
    user_id: '',
    username: '',
    total_playtime: 0,
}

const initializeAllUserStatus = () => {
    for (let guild of client.guilds.cache) {
        guild[1].members.cache.forEach(value => {
            const {user} = value;

            if (users.get(user.id) === undefined && !user.bot) {
                users.set(user.id, []);
                getPlayingActivities(user).forEach(activity => {
                    users.get(user.id).push(
                        {
                            name: activity.name,
                            start: activity.start,
                            end: null,
                        }
                    )
                })
                console.log(user.username, users.get(user.id));
            }
        })
    }
}

const getPlayingActivities = (user) => {
    return user.presence.activities
        .filter((value) => value.type === PLAYING)
        .map(value => {
            return {
                name: value.name,
                start: value.timestamps.start,
                end: null
            }
        });
}

const endActivity = (user_id, activities) => {
    return users.get(user_id).length > activities.length
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
    initializeAllUserStatus();
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
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
    } else if (msg.content === 'test') {
        recordPlaytime('316068755073400842', '7 Billion Humans', 5)
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

    if (prevActivities.length < activities.length) {
        presenceUpdated = true;
        activities.filter(activity => {
            return !prevActivities
                .map(prevActivity => prevActivity.name)
                .find(value => value === activity.name);
        })
            .forEach(value => {
                console.log(value)
            })
    } else {
        console.log("end activity");
        prevActivities.filter(prevActivity => {
            return !activities
                .map(activity => activity.name)
                .find(value => value === prevActivity.name);
        })
            .forEach(endActivity => {
                const curr = new Date();
                const playtime = Math.round((curr - endActivity.start) / 1000);
                recordPlaytime(user_id, endActivity, playtime)
            })
        presenceUpdated = true;
    }
})

client.login(process.env.BOT_TOKEN);
