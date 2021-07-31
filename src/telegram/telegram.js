const fs = require("fs")
const telegram = require("telegram-bot-api")

const config = require("../../config")

var telegrambot

function send(message, tries) {
	tries = tries || 3

	telegrambot.sendMessage({
		chat_id: config.telegramUserId,
		text: message,
		parse_mode: "HTML"
	})
	.catch(error => {
		console.log("\x1b[31m" + "Bot message error: " + error.description, "\x1b[0m")

		if(tries === 1) return

		setTimeout(() => {
			send(message, tries - 1)
		}, 10000)
	})
}

module.exports = function (DB, Storage, Timers) {
	telegrambot = new telegram({ token: config.telegramToken })
	telegrambot.setMessageProvider(new telegram.GetUpdateMessageProvider())
		
	telegrambot.on("update", function(update) {
		if(update.message.from.id !== config.telegramUserId) return

		const files = fs.readdirSync(__dirname + "/commands")

		for (var i = 0; i < files.length; i++) {
			require(__dirname + "/commands/" + files[i])(send, DB, Storage, Timers, update)
		}
	})

	telegrambot.start().then(() => {
		console.log("Telegram ✅")

		send("✅ <b>Chia Alert is running</b>")
	}).catch(console.err)

	return send
}	