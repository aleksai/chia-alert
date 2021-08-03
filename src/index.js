const DB = require("./data/db")
const Storage = require("./data/storage")
const Timers = require("./data/timers")(DB, Storage)
const Telegram = require("./telegram/telegram")(DB, Storage, Timers)

Timers.setTelegram(Telegram)

var exited = false

require("./log/watch")(Telegram, DB, Storage)

function exitHandler(options, exitCode) {
	if(exited) return
	exited = true

    Telegram("🅾️ <b>Chia Alert shutted down</b>")

	if (options.exit) {
		setTimeout(function () {
			process.exit()
		}, 1000)
	}
}

process.on("exit", exitHandler.bind(null, { cleanup: true }))
process.on("SIGINT", exitHandler.bind(null, { exit: true }))
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }))
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }))
process.on("uncaughtException", exitHandler.bind(null, { exit: true }))