const Telegram = require("./telegram")
const Obserser = require("./observer")

const config = require("./config")

const obserser = new Obserser()

obserser.on("file-updated", log => {
	var message = false

	const proofs = /([1-9]{1}[0-9]*) proofs/
	const found = log.message.match(proofs)

	if(found.length) {
		message = "✅"
	}

	if(message) {
		if(config.telegramToken) Telegram(message)
	}
})

obserser.watchFile(config.logFile)