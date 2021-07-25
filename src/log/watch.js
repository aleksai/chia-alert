const { spawn } = require("child_process")
const fs = require("fs")
const homedir = require("os").homedir()
const readLastLines = require("read-last-lines")

const config = require("../../config")

var Telegram, DB, Storage

var timer, spawnprocess, watcherprocess
var last_timecode = "0000-00-00T00:00:00.000"
var currentTotal = 0

var logger

module.exports = function(telegram, db, storage, appData) {
	Telegram = telegram
	DB = db
	Storage = storage

	if(process.platform === "win32") {
		if(appData) logger = fs.createWriteStream(appData + "/watcher.log", { flags: "a" })
	}

	const log = homedir + "/.chia/mainnet/log/debug.log"

	if(!fs.existsSync(log)) return applog("\x1b[31m" + "Log file doesn't exist", "\x1b[0m")

	if(process.platform === "win32") {
		if(watcherprocess) fs.unwatchFile(log)

		watcherprocess = fs.watchFile(log, async (curr, prev) => {
			parseLine(await readLastLines.read(log, 2))
		})
	} else {
		if(spawnprocess) spawnprocess.kill()

		spawnprocess = spawn("tail", ["-F", log])
		spawnprocess.stdout.on("data", (data) => {
			const file = data.toString("utf-8").split("\n")
			const line = file[file.length - 2]

			parseLine(line)
		})
	}
}

function applog(...lines) {
	console.log(lines.join(" "))

	if(logger) logger.write(lines.join(" ") + "\n")
}

function farmingTimer() {
	if(timer) clearTimeout(timer)

	timer = setTimeout(async function() {
		Telegram("🚨")

		await DB.insert("stalls", {})

		applog("\x1b[31m" + "[" + (new Date).toLocaleString() + "] " + "Sync failure or you should 'chia configure -log-level INFO'", "\x1b[0m")
	}, 120000)
}

async function parseLine(line) {
	if(!line) return

	const timecode = /([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})/
	const timecodefound = line.match(timecode)

	// Proofs and Plots

	const proofs = /([1-9]{1}[0-9]*) proofs/
	const found = line.match(proofs)

	const eligible = /([0-9]{1}[0-9]*) plots were/
	const eligiblefound = line.match(eligible)

	const total = /Total ([0-9]*) plots/
	const totalfound = line.match(total)

	const time = /Time: ([0-9.]*)/
	const timefound = line.match(time)

	if(timecodefound && timecodefound.length && timecodefound[1] > last_timecode && eligiblefound && eligiblefound.length && totalfound && totalfound.length && timefound && timefound.length) {
		last_timecode = timecodefound[1]

		const newTotal = parseInt(totalfound[1], 10)

		if(currentTotal !== newTotal) {
			if(currentTotal > 0 && Storage.data.plots === 0) Telegram(newTotal + " 🚜")

			currentTotal = newTotal
		}

		await DB.insert("stats", { 
			timecode: timecodefound[1], 
			eligs: eligiblefound[1], 
			proofs: (found && found.length) ? found[1] : 0, 
			plots: totalfound[1], 
			time: timefound[1]
		})

		farmingTimer()

		if(eligiblefound[1] !== "0")
			applog("[" + (new Date).toLocaleString() + "] " + eligiblefound[1] + " were eligible, total " + totalfound[1] + ", time: " + timefound[1], "\x1b[0m")
	
		if(found && found.length)
			applog("\x1b[32m" + "[" + (new Date).toLocaleString() + "] " + found[1] + " proofs found", "\x1b[0m")
	}

	// Partials

	const partial = /Submitting partial for ([0-9a-f]*) to (https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/
	const partialfound = line.match(partial)

	if(timecodefound && timecodefound.length && timecodefound[1] > last_timecode && partialfound && partialfound.length > 2) {
		last_timecode = timecodefound[1]

		await DB.insert("partials", {
			timecode: timecodefound[1],
			launcher: partialfound[1], 
			url: partialfound[2]
		})

		applog("\x1b[32m" + "[" + (new Date).toLocaleString() + "] " + partialfound[0], "\x1b[0m")

		farmingTimer()
	}

	// Winning

	const farmed = /Farmed unfinished_block/
	const farmedfound = line.match(farmed)

	if(farmedfound && farmedfound.length) {
		await DB.insert("winnings", {
			timecode: timecodefound[1]
		})

		applog("\x1b[32m" + "[" + (new Date).toLocaleString() + "] " + "We're just farmed a block!", "\x1b[0m")

		Telegram("🍀")
	}

	// Warnings and Errors

	const error = /ERROR/
	const totalerror = line.match(error)

	if(totalerror) {
		if(timecodefound && timecodefound.length && timecodefound[1] >= last_timecode) {
			const message = line.replace(timecodefound[1], "")

			await DB.insert("errors", {
				message,
				timecode: timecodefound[1]
			})

			applog("\x1b[31m" + "[" + (new Date).toLocaleString() + "] " + message, "\x1b[0m")

			if(Storage.data.errors === 0) Telegram("<pre>📛 " + message + "</pre>")
		}
	}

	const warning = /WARNING/
	const totalwarning = line.match(warning)

	if(totalwarning) {
		if(timecodefound && timecodefound.length && timecodefound[1] >= last_timecode) {
			const message = line.replace(timecodefound[1], "")

			await DB.insert("warnings", {
				message,
				timecode: timecodefound[1]
			})

			applog("\x1b[31m" + "[" + (new Date).toLocaleString() + "] " + message, "\x1b[0m")

			if(Storage.data.warnings === 0) Telegram("<pre>📛 " + message + "</pre>")
		}
	}
}