const command = "/set"

module.exports = function(Telegram, DB, Storage, Timers, update) {

	if(update.message && update.message.text.startsWith(command)) {
		function help() {
			Telegram("\
				<b>Available settings:</b>\n\n<i>all settings are X hours between bot summaries, set it to be every 1, 2, 3... hours, set 0 to make it live</i>\n\n\
				- Plots 🚜, current: <b><i>/set plots " + parseInteger(Storage.data.plots) + "</i></b>\n\
				- Pooling 🏊‍♂️, current: <b><i>/set pooling " + parseInteger(Storage.data.pooling) + "</i></b>\n\
				- Warnings ⚠️, current: <b><i>/set warnings " + parseInteger(Storage.data.warnings) + "</i></b>\n\
				- Errors 📛, current: <b><i>/set errors " + parseInteger(Storage.data.errors) + "</i></b>\
			")
		}

		function parseInteger(value) {
			if(value === -1) return "disable"

			return value
		}

		function parseValue(value) {
			const integer = parseInt(value, 10)

			if(integer || integer === 0) return integer
			else if(value === "disable") return -1
			else return false
		}

		const args = update.message.text.replace(command, "").trim().split(" ")

		if(args.length === 2) {
			switch(args[0]) {
				case "plots":
				case "pooling":
				case "warnings":
				case "errors":
					const value = parseValue(args[1])

					if(value !== false) {
						Storage.set(args[0], value)
						Timers.update(args[0])

						Telegram("Timer <b>" + args[0] + "</b> now " + args[1] + "h")

						return
					}
				break
			}
		}

		help()
	}

}