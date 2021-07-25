const command = "/set"

module.exports = function(Telegram, DB, update) {
	if(update.message && update.message.text.startsWith(command)) {
		const args = update.message.text.replace(command, "").trim().split(" ")

		if(args.length === 2) {

		} else {
			Telegram("\
				<b>Available settings:</b>\n\n<i>all settings are X hours between bot summaries, set it to be every 1, 2, 3... hours, set 0 to make it live</i>\n\n\
				- Plots 🚜, ex. <b><i>/set plots 0</i></b>\n\
				- Pooling 🏊‍♂️, ex. <b><i>/set pooling 1</i></b>\n\
				- Warnings ⚠️, ex. <b><i>/set warnings disable</i></b>\n\
				- Errors 📛, ex. <b><i>/set errors 1</i></b>\
			")
		}
	}
}