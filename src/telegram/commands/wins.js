const command = "/wins"

module.exports = async function(Telegram, DB, Storage, Timers, update) {

	if(update.message && update.message.text.startsWith(command)) {
		const pagesize = 5

		function sendChunk(wins, page) {
			page = page || 0

			var message = page ? "" : "🍀 <b>All winnings since you look for them:</b>\n\n"

			for (var i = page * pagesize; i < Math.min(wins.length, (page + 1) * pagesize); i++) {
				message += "<pre>" + wins[i].timecode + "</pre>\n"

				DB.update("winnings", wins[i].id, { seen: 1 })
			}

			Telegram(message)

			if(wins.length > ((page + 1) * pagesize)) setTimeout(() => {
				sendChunk(wins, page + 1)
			}, 200)
			else setTimeout(() => {
				Telegram(wins.length + " total")
			}, 600)
		}

		const wins = await DB.all("winnings", { seen: 0 })

		if(wins.length) {
			sendChunk(wins)
		} else {
			Telegram("No new wins")
		}
	}

}