const { spawn } = require("child_process")
const homedir = require("os").homedir()

const config = require("../config")

const Telegram = require("./telegram")

var currentTotal = 0
var syncTimer

var trackDate = new Date()
var trackCount = 0
var proofCount = 0

const tail = spawn("tail", ["-F", homedir + "/.chia/mainnet/log/debug.log"])

console.log("Starting to watch " + homedir + "/.chia/mainnet/log/debug.log...")

tail.stdout.on("data", function (data) {
	const file = data.toString("utf-8").split("\n")
	const line = file[file.length - 2]

	// Proofs

	var proof = false

	const proofs = /([1-9]{1}[0-9]*) proofs/
	const found = line.match(proofs)

	if(found && found.length) {
		if(config.telegramToken) Telegram("🍀")
		proof = true
	}

	// Count plots

	const eligible = /([1-9]{1}[0-9]*) plots were/
	const eligiblefound = line.match(eligible)

	const total = /Total ([0-9]*) plots/
	const totalfound = line.match(total)

	const time = /Time: ([0-9.]*)/
	const timefound = line.match(time)

	if(eligiblefound && eligiblefound.length && totalfound && totalfound.length && timefound && timefound.length) {
		const newTotal = parseInt(totalfound[1], 10)
		if(currentTotal !== newTotal) {
			if(currentTotal > 0 && config.telegramToken) Telegram(newTotal + " 🚜")
			currentTotal = newTotal
		}

		trackCount += parseInt(eligiblefound[1], 10)

		if(proof) {
			proofCount++
			console.log("\x1b[32m")
		}
		console.log("[" + (new Date).toLocaleString() + "] " + eligiblefound[1] + " were eligible, total " + totalfound[1] + ", time: " + timefound[1], "\x1b[0m")
	}

	// Stats

	const currentDate = new Date()

	if(currentDate - trackDate > 60 * 60 * 1000) {
		console.log("\x1b[40m\x1b[33m", "Stats: " + trackCount + " proofs seeked, " + proofCount + " proofs found", "\x1b[0m")
		
		trackDate = currentDate
		trackCount = 0
		proofCount = 0
	}

	// Check gap between challenges

	if(totalfound && totalfound.length) {
		if(syncTimer) clearTimeout(syncTimer)

		syncTimer = setTimeout(function(){
			Telegram("🚨")
			console.log("\x1b[31m", "[" + (new Date).toLocaleString() + "] " + "Sync failure?", "\x1b[0m")
		}, 2 * 60 * 1000)
	}

	// Warnings

	const warning = /WARNING/
	const totalwarning = line.match(warning)

	if(totalwarning) {
		if(
			!line.includes("Err.DOUBLE_SPEND") &&
			!line.includes("Err.COIN_AMOUNT_NEGATIVE")
		) {
			console.log("\x1b[31m", line, "\x1b[0m")
		}
	}
})