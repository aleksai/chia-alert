const command = "/errors"

module.exports = function(Telegram, DB, Storage, Timers, update) {

	if(update.message && update.message.text.startsWith(command)) {
		Telegram("\
			errors\
		")
	}

}