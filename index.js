const Telegram = require("./telegram")
const { spawn } = require("child_process")

const config = require("./config")

var currentTotal = 0

const tail = spawn("tail", ["-F", config.logFolder + "/debug.log"])

tail.stdout.on("data", function (data) {
	const file = data.toString("utf-8").split("\n")
	const line = file[file.length - 2]

	var message = false

	const proofs = /([1-9]{1}[0-9]*) proofs/
	const found = line.match(proofs)

	if(found && found.length) {
		message = "✅"
	}

	const eligible = /([1-9]{1}[0-9]*) plots were/
	const eligiblefound = line.match(eligible)

	const total = /Total ([0-9]*) plots/
	const totalfound = line.match(total)

	const time = /Time: ([0-9.]*)/
	const timefound = line.match(total)

	if(eligiblefound && eligiblefound.length && total && totalfound.length && time && timefound.length) {
		const newTotal = parseInt(totalfound[1], 10)
		if(currentTotal !== newTotal) {
			if(currentTotal > 0) Telegram("New plot: " + newTotal)
			currentTotal = newTotal
		}

		console.log("[" + (new Date).toLocaleString() + "] " + eligiblefound[1] + " were eligible, total " + totalfound[1] + ", time: " + timefound[1])
	}

	const warning = /WARNING/
	const totalwarning = line.match(warning)

	if(totalwarning) {
		console.log("\x1b[31m", line, "\x1b[0m")
	}

	if(message) {
		if(config.telegramToken) Telegram(message)
	}
})