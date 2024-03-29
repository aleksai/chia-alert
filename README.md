# ChiaAlert

Self-hosted Telegram Chat bot to watch your Chia farm statistics, and got notifications on important events.

<img src="https://i.ibb.co/qjRnP0K/screenshot.png" alt="Screenshot" width="500"/>

## Install (Linux/Mac OS):

*Node.js and NPM must be installed.* Follow https://docs.npmjs.com/downloading-and-installing-node-js-and-npm for instructions.

```
cd ~
git clone https://github.com/alek-sai/chia-alert.git -b release
cd chia-alert
npm i
cp config.js.example config.js
```

Now edit `config.js` with your telegram bot token and your telegram ID(if you don't know it, obtain with https://t.me/userinfobot). Instructions how to create your bot follow https://core.telegram.org/bots#6-botfather

Don't forget to start a chat with bot in Telegram after bot initial creation. 

```
# Execute this to start:
npm run start

# To stop:
npm run stop
```
Start command will give you log file address, feel free to watch it, it's more clean than Chia one, to watch execute for example:
```
tail -f /home/user/.forever/qv31.log
```

## Install (Windows):

*TODO*

## Roadmap:

- Stats(plotting, pooling, etc)
- Русский язык (Russian locale)
- Simple standalone app execution (Windows, Linux, MacOS)
- Group chats bot integration
- Discord, Slack, Facebook
- (Still considering due to safety reasons) Farm control

Add your suggestions about new functions in Issues.

Discord: https://discord.gg/UqaxDK9q
