const oneHourMs = 60 * 1000// * 60

module.exports = function (DB, Storage) {

	var Telegram

	const summaries = {

		plots: async function() {
			const stats = await DB.all("stats", false, " where created > " + (Date.now() - (Storage.data.plots + 1) * oneHourMs))

			
		},

		pooling: async function() {
			const partials = await DB.all("partials", false, " where created > " + (Date.now() - (Storage.data.pooling + 1) * oneHourMs))

			
		},

		warnings: async function() {
			const warnings = await DB.all("warnings", false, " where created > " + (Date.now() - (Storage.data.plots + 1) * oneHourMs))

			
		},

		errors: async function() {
			const errors = await DB.all("errors", false, " where created > " + (Date.now() - (Storage.data.plots + 1) * oneHourMs))

			
		}

	}

	var timers = {
		plots: [],
		pooling: [],
		warnings: [],
		errors: []
	}

	var intervals = {
		plots: [],
		pooling: [],
		warnings: [],
		errors: []
	}

	const setTimer = function(timer) {
		return Storage.data[timer] < 1 ? false : setTimeout(function() {
			summaries[timer]()
			intervals[timer].push(setInterval(summaries[timer], oneHourMs * Storage.data[timer]))
		}, msToNextHour())
	}

	const msToNextHour = function() {
		var date = new Date()
		var rounded = new Date(Math.ceil(date.getTime() / oneHourMs) * oneHourMs)

		console.log(rounded)

	    return rounded.getTime() - Date.now()
	}

	const update = function(timer) {
		for (var i = 0; i < timers[timer].length; i++) {
			clearTimeout(timers[timer][i])
		}

		for (var i = 0; i < intervals[timer].length; i++) {
			clearInterval(intervals[timer][i])
		}

		timers[timer] = []
		intervals[timer] = []

		const timeout = setTimer(timer)

		if(timeout) timers[timer].push(timeout)
	}

	const updateAll = function() {
		const summariesKeys = Object.keys(summaries)

		for (var i = 0; i < summariesKeys.length; i++) {
			update(summariesKeys[i])
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