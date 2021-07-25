var Telegram

var Timers = function (DB, Storage) {

	return {

		setTelegram: function(telegram) {
			Telegram = telegram
		},

		updateAll: function() {

		}

	}

}

module.exports = Timers