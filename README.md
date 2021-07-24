# ChiaAlert

Self-owned Telegram Chat bot to watch your Chia farm statistics, and got notifications on important events.

## Install (Linux/Mac OS):

*Node.js and NPM must be installed.* Follow https://docs.npmjs.com/downloading-and-installing-node-js-and-npm for instructions.

```
cd ~
git clone https://github.com/alek-sai/chia-alert.git
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

## Install (Windows):

*TODO*
