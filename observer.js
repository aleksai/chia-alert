const chokidar = require("chokidar")
const EventEmitter = require("events").EventEmitter
const readLastLines = require("read-last-lines")

class Observer extends EventEmitter {
  constructor() {
    super()
  }

  watchFile(targetFile) {
    try {
      var watcher = chokidar.watch(targetFile, { persistent: true })

      watcher.on("change", async filePath => {
        var updateContent = await readLastLines.read(filePath, 1)

        this.emit("file-updated", { message: updateContent })
      })

      console.log("File ✅")
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Observer