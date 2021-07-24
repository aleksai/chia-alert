const fs = require("fs")
const telegram = require("telegram-bot-api")

const config = require("../../config")

var telegrambot

function send(message) {
	telegrambot.sendMessage({
		chat_id: config.telegramUserId,
		text: message
	}).catch(console.err)
}

module.exports = function (DB) {
	telegrambot = new telegram({ token: config.telegramToken })
	telegrambot.setMessageProvider(new telegram.GetUpdateMessageProvider())
		
	telegrambot.on("update", function(update) {
		if(update.message.from.id !== config.telegramUserId) return

		const files = fs.readdirSync(__dirname + "/commands")

		for (var i = 0; i < files.length; i++) {
			require(__dirname + "/commands/" + files[i])(send, DB, update)
		}
	})

	telegrambot.start().then(() => {
		console.log("Telegram ✅")

		telegrambot.sendMessage({
			chat_id: config.telegramUserId,
			text: "✅ Chia Alert is running"
		})
	}).catch(console.err)

	return send
}	