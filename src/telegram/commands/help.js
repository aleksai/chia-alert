const command = "/help"

module.exports = function(Telegram, DB, update) {
	if(update.message && update.message.text.startsWith(command)) {
		Telegram("\
			<b>Available commands:</b>\n\n\
			- Plotting stats for period, ex. <b><i>/plots 12h, /plots 5d, /plots alltime</i></b>\n\
			- Pooling stats for period, ex. <b><i>/pooling 12h, /pooling 2d, /pooling 3w</i></b>\n\
			- Winnings 🍀, ex. <b><i>/wins</i></b>\n\
			- New warnings ⚠️, ex. <b><i>/warnings</i></b>\n\
			- New errors 📛, ex. <b><i>/errors</i></b>\n\
			- Settings, ex. <b><i>/set</i></b>\
		")
	}
}