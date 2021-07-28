require('dotenv').config();
const Discord = require('discord.js');
const {insert, findUser, addUser} = require('./plugins/MongoDB');
const intents = Discord.Intents.ALL;
const client = new Discord.Client({intents:[intents]});

const PLAYING = 'PLAYING';
const initialUserState = {
    user_id:'',
    username:'',
    total_playtime:0,
}

const getUsers = (receivedMessage)=>{
    let data = [];
    receivedMessage.guild.members.cache.forEach(value => {
        if(!value.user.bot) {
            data.push({
                ...initialUserState,
                user_id:value.user.id,
                username:value.user.username,
            })
        }
    });
    return data;
}

const getUsername = (receivedMessage)=>{
    return receivedMessage.author.username;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }else if(msg.content ==='insert'){
        insert();
    }else if(msg.content === 'add'){
        // database에 user추가
        findUser(msg.author.id);
    }else if(msg.content==='addchannel'){
        // database에 채널 생성
        // 원래는 봇이 채널에 들어가면 바로 실행해야함.

    }
    else if(msg.content==='addalluser'){
        // 메시지 보낸 서버의 모든 유저 데이터 생성
        // 마찬가지로 봇이 채널에 들어가면 바로 실행해야함.
        addUser(getUsers(msg));
    }
});



let presenceUpdated = false;
client.on('presenceUpdate', (oldMember, newMember)=>{
    if(presenceUpdated){
        presenceUpdated = false;
        return;
    }
    const activity = newMember.user.presence.activities;
    if(activity.length>0){
        presenceUpdated = true;
        if(newMember.user.presence.activities[0].type===PLAYING){
            console.log(newMember.user.presence.activities[0])
            console.log(newMember.user.presence.activities[0].name);
            console.log(newMember.user.presence.activities[0].timestamps.start);
        }
    }else{
        console.log('status clear')
        presenceUpdated = true;
    }


})

client.login(process.env.BOT_TOKEN);
