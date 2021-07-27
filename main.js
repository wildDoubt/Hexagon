require('dotenv').config();
const Discord = require('discord.js');
const {insert, findUser} = require('./plugins/MongoDB');
const intents = Discord.Intents.ALL;
const client = new Discord.Client({intents:[intents]});

const PLAYING = 'PLAYING';

const getUsers = (receivedMessage)=>{
    // console.log(receivedMessage)

    receivedMessage.guild.members.cache.forEach(value => {
        if(!value.user.bot) {
            console.log(value.user.username, value.user.id)
        }
    })
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
    }else if(msg.content==='test'){
        getUsers(msg);
    }else if(msg.content ==='insert'){
        insert();
    }else if(msg.content === 'add'){
        // database에 user추가
        findUser(msg.author.id);
    }
});

const initialHistory = {
    username:'',
    game:{

    }

}

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
