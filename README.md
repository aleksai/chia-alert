# ChiaAlert

Tiny tool to be automatically notificated when your Chia rewards has come.

## Install (Linux/Mac OS):

*Node.js and NPM must be installed.* Follow https://docs.npmjs.com/downloading-and-installing-node-js-and-npm for instructions.

```
cd ~
git clone https://github.com/alek-sai/chia-alert.git
cd chia-alert
npm i
cp config.js.example config.js

# Execute this to start:
npm run start

# To stop:
npm run stop
```

Edit `config.js` with your telegram bot token and your telegram ID. Don't forget to start a chat with bot in Telegram after bot initial creation. Instructions how to create your bot follow https://core.telegram.org/bots#6-botfather

## Install (Windows):

*TODO*