const command = "/help"

module.exports = function(Telegram, DB, Storage, Timers, update) {

	// - Plotting stats for period, ex. <b><i>/plots 12h, /plots 5d, /plots alltime</i></b>\n\
	// - Farming stats for period, ex. <b><i>/farming 2h, /farming 7d, /farming alltime</i></b>\n\
	// - Pooling stats for period, ex. <b><i>/pooling 12h, /pooling 2d, /pooling 3w</i></b>\n\

	if(update.message && update.message.text.startsWith(command)) {
		Telegram("\
			<b>Available commands:</b>\n\n\
			- Winnings 🍀, <b><i>/wins</i></b>\n\
			- New warnings ⚠️, <b><i>/warnings</i></b>\n\
			- New errors 📛, <b><i>/errors</i></b>\n\
			- Settings, <b><i>/set</i></b>\n\
			- Help, <b><i>/help</i></b>\
		")
	}

}