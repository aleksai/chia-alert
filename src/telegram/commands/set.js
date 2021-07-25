const command = "/set"

module.exports = function(Telegram, DB, Storage, Timers, update) {
	if(update.message && update.message.text.startsWith(command)) {
		function help() {
			Telegram("\
				<b>Available settings:</b>\n\n<i>all settings are X hours between bot summaries, set it to be every 1, 2, 3... hours, set 0 to make it live</i>\n\n\
				- Plots 🚜, ex. <b><i>/set plots 0</i></b>\n\
				- Pooling 🏊‍♂️, ex. <b><i>/set pooling 1</i></b>\n\
				- Warnings ⚠️, ex. <b><i>/set warnings disable</i></b>\n\
				- Errors 📛, ex. <b><i>/set errors 1</i></b>\
			")
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
						
						Timers.updateAll()

						return
					}
				break
			}
		}

		help()
	}
}