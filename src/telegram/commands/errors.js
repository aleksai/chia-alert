const command = "/errors"

module.exports = async function(Telegram, DB, Storage, Timers, update) {

	if(update.message && update.message.text.startsWith(command)) {
		const pagesize = 5

		function sendChunk(errors, page) {
			page = page || 0

			var message = page ? "" : "📛 <b>All errors since you look for them:</b>\n"

			for (var i = page * pagesize; i < Math.min(errors.length, (page + 1) * pagesize); i++) {
				message += "\n<pre>" + errors[i].timecode + "</pre> " + errors[i].message.replace(/[<>]*/g, '') + "\n"

				DB.update("errors", errors[i].id, { seen: 1 })
			}

			Telegram(message)

			if(errors.length > ((page + 1) * pagesize)) setTimeout(() => {
				sendChunk(errors, page + 1)
			}, 200)
			else setTimeout(() => {
				Telegram(errors.length + " total")
			}, 600)
		}

		const errors = await DB.all("errors", { seen: 0 })

		if(errors.length) {
			sendChunk(errors)
		} else {
			Telegram("No new errors")
		}
	}

}