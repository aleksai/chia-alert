const fs = require("fs")
const homedir = require("os").homedir()

const log = homedir + "/.chia/mainnet/log/debug.log"

if(!fs.existsSync(log)) {
	if(!fs.existsSync(homedir + "/.chia")) fs.mkdirSync(homedir + "/.chia")
	if(!fs.existsSync(homedir + "/.chia/mainnet")) fs.mkdirSync(homedir + "/.chia/mainnet")
	if(!fs.existsSync(homedir + "/.chia/mainnet/log")) fs.mkdirSync(homedir + "/.chia/mainnet/log")

	fs.closeSync(fs.openSync(log, "w"))
}

function appendLine(message) {
	fs.appendFileSync(log, message + "\n")
}

var plots = 100

setInterval(function () {
	if(Math.random() < 0.75) {
		const elig = 3
		const proofs = Math.random() < 0.9 ? 0 : 1
		const time = 0.123

		plots++

		appendLine("2021-07-23T04:53:05.612 harvester chia.harvester.harvester: INFO     " + elig + " plots were eligible for farming f71c3375c9... Found " + proofs + " proofs. Time: " + time + " s. Total " + plots + " plots")
	} else {
		appendLine("2021-07-23T05:14:52.382 farmer chia.farmer.farmer         : INFO     Submitting partial for 33eef10078514a0f9e70c71c149ceb0674cfd6137729a8ba0f0ace14fa4a52de to https://asia1.pool.space")
	}
}, 5000)