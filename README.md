# Hexagon

Hexagon is a "Discord bot" who can tracked the activity of each member in the channel.

## To Do

### Main
- 전체 게임 플레이타임 조회
- 최근 일주일 또는 한달동안 플레이한 기록 조회
- 같은 채널 내의 다른 유저의 스탯 조회
- 같은 채널 내에서 작동하는 리더보드 기능 구현
- 주로 활동하는 시간대 조회

### Dev
- 새로운 유저가 채널에 들어왔을 때
- 2개 이상 게임을 플레이 중일 때

## Environments

- node v14.15.4
- mongodb v4.0.1
- discord.js v12.5.3
- dotenv

## How to Use Hexagon

1. Clone this project
   `git clone https://github.com/wildDoubt/Hexagon.git`
   
2. Modify BOT_TOKEN on the last line of `main.js`

3. Recommended connecting to [Atlas](https://www.mongodb.com/cloud/atlas) to use the cloud database.

4. Modify uri on `plugins/MongoDB/index.js`

```javascript
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.tywvp.mongodb.net/Cluster0?retryWrites=true&w=majority`;
```
