const Telegram = require("./telegram")
const Obserser = require("./observer")

const config = require("./config")

const obserser = new Obserser()

var currentTotal = 0

obserser.on("file-updated", log => {
	var message = false

	const proofs = /([1-9]{1}[0-9]*) proofs/
	const found = log.message.match(proofs)

	if(found && found.length) {
		message = "✅"
	}

	const eligible = /([1-9]{1}[0-9]*) plots were/
	const eligiblefound = log.message.match(eligible)

	const total = /Total ([0-9]*) plots/
	const totalfound = log.message.match(total)

	if(eligiblefound && eligiblefound.length && total && totalfound.length) {
		const newTotal = parseInt(totalfound[1], 10)
		if(currentTotal !== newTotal) {
			if(currentTotal > 0) Telegram("New plot: " + newTotal)
			currentTotal = newTotal
		}

		console.log("[" + (new Date).toLocaleString() + "] " + eligiblefound[1] + " were eligible, total " + totalfound[1])
	}

	if(message) {
		if(config.telegramToken) Telegram(message)
	}
})

obserser.watchFile(config.logFile)