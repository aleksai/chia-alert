const oneHourMs = 1000 * 60 * 60

function pluralize(count, words) { // ["депутат", "депутата", "депутатов"]
    var cases = [2, 0, 1, 1, 1, 2]
    return count + " " + words[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[ Math.min(count % 10, 5)]]
}

module.exports = function (DB, Storage) {

	var Telegram

	const summaries = {

		plots: async function() {
			const stats = await DB.all("stats", false, " where created > " + (Date.now() - Storage.data.plots * oneHourMs))
			if(!stats) return

			const partials = await DB.all("partials", false, " where created > " + (Date.now() - Storage.data.plots * oneHourMs))
			const winnings = await DB.all("winnings", false, " where created > " + (Date.now() - Storage.data.plots * oneHourMs))

			const stat = "<b>" + 
				pluralize(stats[stats.length - 1].plots - stats[0].plots, ["plot", "plots", "plots"]) + "</b> created, <b>" + 
				pluralize(stats.map(s => s.eligs).reduce((a, b) => a + b, 0), ["time", "times", "times"]) + "</b> plots been <b>eligible</b>\n<b>" + 
				pluralize(stats.map(s => s.proofs).reduce((a, b) => a + b, 0), ["proof", "proofs", "proofs"]) + "</b> found, <b>" + partials.length + "</b> of which <b>" + 
				pluralize(partials.length, ["was a partial", "were partials", "were partials"]) + "</b>, <b>" + 
				pluralize(winnings.length, ["win! 🍀", "winnings", "winnings"]) + "</b>"

			Telegram("🚜 <b>Farming stats for last " + Storage.data.plots + "h:</b>\n\n" + stat)
		},

		pooling: async function() {
			const partials = await DB.all("partials", false, " where created > " + (Date.now() - Storage.data.pooling * oneHourMs))
			if(!partials || !partials.length) return

			const launchers = partials.map(p => p.launcher)
			const launchers_filtered = launchers.filter((i, p) => launchers.indexOf(i) === p)

			const stat = launchers_filtered.map(l => "<pre>" + l.substr(0, 5) + "..." + l.substr(l.length - 5, 5) + "</pre> sent <b>" + partials.filter(p => p.launcher === l).length + " partials</b> to " + partials.filter(p => p.launcher === l)[0].url.replace("https://", "")).join("\n")

			Telegram("🏊‍♂️ <b>Pooling stats for last " + Storage.data.pooling + "h:</b>\n\n" + stat)
		},

		warnings: async function() {
			const warnings = await DB.all("warnings", false, " where created > " + (Date.now() - Storage.data.warnings * oneHourMs))
			if(!warnings || !warnings.length) return

			Telegram("⚠️ <b>" + pluralize(warnings.length, ["warning", "warnings", "warnings"]) + "</b> in last " + Storage.data.warnings + "h, get unseen warnings with <b><i>/warnings</i></b>")
		},

		errors: async function() {
			const errors = await DB.all("errors", false, " where created > " + (Date.now() - Storage.data.errors * oneHourMs))
			if(!errors || !errors.length) return

			Telegram("📛 <b>" + pluralize(errors.length, ["error", "errors", "errors"]) + "</b> in last " + Storage.data.errors + "h, get unseen errors with <b><i>/errors</i></b>")
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

		updateAll,
		update

	}

}