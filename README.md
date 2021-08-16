# Hexagon

Hexagon is a "Discord bot" who can tracked the activity of each member in the channel.

## Features

### Visualize a history of your gaming.
  
   ![example](example.jpg)

## To Do

- Visualize weekly game stats. [underdeveloped]
- Shows the stats of other users on the same server.
- Leaderboard of user's total playtime.
- 주로 활동하는 시간대 조회

## Environments

- node v14.15.4
- mongodb v4.0.1
- discord.js v12.5.3
- dotenv

## How to Use Hexagon

1. Clone this project
   `git clone https://github.com/wildDoubt/Hexagon.git`
   
2. Modify BOT_TOKEN on the last line of `app.js`

3. Recommended connecting to [Atlas](https://www.mongodb.com/cloud/atlas) to use the cloud database.
   
4. Modify uri on `plugins/MongoDB/app.js`

   ```javascript
   const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.tywvp.mongodb.net/Cluster0?retryWrites=true&w=majority`;
   ```

5. Run app.js

   `node app.js`

6. [Invite your discord bot](https://discordpy.readthedocs.io/en/stable/discord.html)
