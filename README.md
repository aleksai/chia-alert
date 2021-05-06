# ChiaAlert

Tiny tool to be automatically notificated when your Chia reward has come.

## Install:

```
cd ~
git clone https://github.com/lenyapugachev/chia-alert.git
cd chia-alert
cp config.js.example config.js
```

Edit `config.js` with your telegram bot token and your telegram ID. Don't forget to start a bot chat in Telegram.
Also, change `logFile` to Chia log filepath on your system. It should be configured to contain INFO messages.

## Start:

```
node .
```
