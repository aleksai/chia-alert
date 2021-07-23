const telegram = require("telegram-bot-api")

const config = require("../config")

const telegrambot = new telegram({ token: config.telegramToken })
telegrambot.setMessageProvider(new telegram.GetUpdateMessageProvider())

telegrambot.start().then(() => {
	console.log("Telegram ✅")

	telegrambot.sendMessage({
		chat_id: config.telegramUserId,
		text: "✅ Chia Alert is running"
	})
})

module.exports = function (message) {
	telegrambot.sendMessage({
		chat_id: config.telegramUserId,
		text: message
	})
}	