const fs = require("fs")

const dataFile = "storage.db"

var data = fs.existsSync(dataFile) ? fs.readFileSync(dataFile, "utf8") : null
if(data) data = JSON.parse(data)

var Storage = {

	data: data ? data : {
		plots: 0,
		pooling: 24,
		warnings: -1,
		errors: 1,
	},

	set: (key, value) => {
		Storage.data[key] = value

		fs.writeFileSync(dataFile, JSON.stringify(Storage.data))
	}

}

module.exports = Storage