const Telegram = require("./telegram")

var exited = false

require("./watcher")(Telegram)

function exitHandler(options, exitCode) {
	if(exited) return
	exited = true

    Telegram("🅾️ Chia Alert shutted down")

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