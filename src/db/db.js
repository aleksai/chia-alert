const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

var db

async function init() {
	db = await open({
		filename: "../db.sqlite",
		driver: sqlite3.Database
	})
}

init()

async function createTableIfNotExists(table) {
	var structure

	switch (table) {
		case "stats":
			structure = "timecode TEXT, eligs INTEGER, proofs INTEGER, plots INTEGER, time REAL"
		break
		case "partials":
			structure = "timecode TEXT, launcher TEXT, url TEXT"
		break
		case "winnings":
			structure = "timecode TEXT, seen INTEGER"
		break
		case "stalls":
			structure = "seen INTEGER"
		break
		case "errors":
		case "warnings":
			structure = "timecode TEXT, message TEXT, seen INTEGER"
		break
	}

	if(structure) {
		await db.exec("CREATE TABLE IF NOT EXISTS " + table + " (id INTEGER PRIMARY KEY AUTOINCREMENT, " + structure + ", created INTEGER)")

		return true
	} else {
		return false
	}
}

function generateValuesFor(table, values) {
	values = values || {}

	switch (table) {
		case "stats":
			return '"' + values.timecode + '", ' + values.eligs + ', ' + values.proofs + ', ' + values.plots + ', ' + values.time
		case "partials":
			return '"' + values.timecode + '", "' + values.launcher+ '", "' + values.url + '"'
		case "winnings":
			return '"' + values.timecode + '", 0'
		case "stalls":
			return '0'
		case "errors":
		case "warnings":
			return '"' + values.timecode + '", "' + values.message + '", 0'
	}
}

const DB = {

	insert: async function (table, values) {
		if(!table || !values) return false
		if(!(await createTableIfNotExists(table))) return false

		await db.exec("INSERT INTO " + table + " VALUES (null, " + generateValuesFor(table, values) + ", " + Date.now() + ")")
	},

	get: async function (table, id) {
		if(!table || !id) return false

		return await db.all("SELECT * from " + table + " where id = ?", [id])
	},

	all: async function (table, filter) {
		filter = filter || false

		if(!table) return false
		
		return await db.all("SELECT * from " + table + (filter ? (" where " + Object.keys(filter).join(" = ? AND ") + " = ?") : ""), Object.values(filter))
	}

}

module.exports = DB