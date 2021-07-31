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
	const ran = Math.random()
	
	if(ran > 0.98) {
		appendLine(new Date().toISOString() + " full_node full_node_server        : INFO    🍀 ️Farmed unfinished_block ab1ab1ab1, SP: e0example, ")
	} else if(ran > 0.96) {
		appendLine(new Date().toISOString() + " full_node full_node_server        : ERROR    Exception: Failed to fetch block 613170 from {'host': '220.132.79.154', 'port': 8444}, timed out <class 'ValueError'>, closing connection {'host': '220.132.79.154', 'port': 8444}. Traceback (most recent call last):")
	} else if(ran > 0.94) {
		appendLine(new Date().toISOString() + " full_node full_node_server        : WARNING  Cannot write to closing transport 217.66.160.107")
	} else if(ran < 0.75) {
		const elig = 3
		const proofs = Math.random() < 0.96 ? 0 : 1
		const time = 0.123

		if(Math.random() > 0.92) plots++

		appendLine(new Date().toISOString() + " harvester chia.harvester.harvester: INFO     " + elig + " plots were eligible for farming f71c3375c9... Found " + proofs + " proofs. Time: " + time + " s. Total " + plots + " plots")
	} else {
		const ran = Math.random()
		const launcher = ran > 0.5 ? "99abc10078514a0f9e70c71c149ceb0674cfd6137729a8ba0f0ace14fa409aeb" : "33eef10078514a0f9e70c71c149ceb0674cfd6137729a8ba0f0ace14fa4a52de"
		const server = ran > 0.5 ? "asia1.pool.space" : "na1.pool.space"
		appendLine(new Date().toISOString() + " farmer chia.farmer.farmer         : INFO     Submitting partial for " + launcher + " to https://" + server)
	}
}, 5000)