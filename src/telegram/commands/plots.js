const command = "/plots"

module.exports = function(Telegram, DB, Storage, Timers, update) {

	if(update.message && update.message.text.startsWith(command)) {
		Telegram("\
			To be implemented\
		")
	}

}