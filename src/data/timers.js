const oneHourMs = 60 * 60 * 1000

module.exports = function (DB, Storage) {

	var Telegram

	var timers = []
	var intervals = []

	const summaries = {

		plots: function() {

		},

		warnings: function() {

		},

		errors: function() {

		}

	}

	const setTimer = function(timer) {
		return setTimeout(function() {
			intervals.push(setInterval(summaries[timer], oneHourMs * Storage.data[timer]))
		}, msToNextHour())
	}

	const msToNextHour = function() {
		var date = new Date()
		date.setHours(date.getHours() + Math.round(date.getMinutes()/60))
	    date.setMinutes(0, 0, 0)

	    return Date.now() - date.getTime()
	}

	const updateAll = function() {
		for (var i = 0; i < timers.length; i++) {
			clearTimeout(timers[i])
		}

		for (var i = 0; i < intervals.length; i++) {
			clearInterval(intervals[i])
		}

		timers = []
		intervals = []

		const summaryTimers = Object.keys(summaries)

		for (var i = 0; i < summaryTimers.length; i++) {
			timers.push(setTimer(summaryTimers[i]))
		}
	}

	return {

		setTelegram: function(telegram) {
			Telegram = telegram

			updateAll()
		},

		updateAll

	}

}