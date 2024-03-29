const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

var db

async function init() {
	db = await open({
		filename: "db.sqlite",
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

		try {
			await db.exec("INSERT INTO " + table + " VALUES (null, " + generateValuesFor(table, values) + ", " + Date.now() + ")")
		} catch(e) {
			return false
		}
	},

	update: async function (table, id, set) {
		if(!table || !id || !set) return false

		try {
			await db.run("UPDATE " + table + " SET " + Object.keys(set).map(s => s + " = ?").join(", ") + " where id = ?", ...Object.values(set), id)
		} catch(e) {
			return false
		}
	},

	get: async function (table, id) {
		if(!table || !id) return false

		try {
			return await db.all("SELECT * from " + table + " where id = ?", [id])
		} catch(e) {
			return false
		}
	},

	all: async function (table, filter, raw) {
		filter = filter || false
		raw = raw || false

		if(!table) return false
		
		try {
			return await db.all("SELECT * from " + table + (raw ? raw : (filter ? (" where " + Object.keys(filter).join(" = ? AND ") + " = ?") : "")), filter ? Object.values(filter) : [])
		} catch(e) {
			return false
		}
	}

}

module.exports = DB