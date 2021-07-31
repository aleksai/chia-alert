const command = "/warnings"

module.exports = async function(Telegram, DB, Storage, Timers, update) {

	if(update.message && update.message.text.startsWith(command)) {
		const pagesize = 5

		function sendChunk(warnings, page) {
			page = page || 0

			var message = page ? "" : "⚠️ <b>All warnings since you look for them:</b>\n"

			for (var i = page * pagesize; i < Math.min(warnings.length, (page + 1) * pagesize); i++) {
				message += "\n<pre>" + warnings[i].timecode + "</pre> " + warnings[i].message.replace(/[<>]*/g, '') + "\n"

				DB.update("warnings", warnings[i].id, { seen: 1 })
			}

			Telegram(message)

			if(warnings.length > ((page + 1) * pagesize)) setTimeout(() => {
				sendChunk(warnings, page + 1)
			}, 200)
			else setTimeout(() => {
				Telegram(warnings.length + " total")
			}, 600)
		}

		const warnings = await DB.all("warnings", { seen: 0 })

		if(warnings.length) {
			sendChunk(warnings)
		} else {
			Telegram("No new warnings")
		}
	}

}