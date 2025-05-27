const { dotenv } = require("./src/configs/importModules")
dotenv.config()
const server = require("./src/server")

const port = process.env.Port || 5000

const startServer = () => {
    server.listen(port, () => {
        console.log("Welcome", process.env.Port)
        console.log("Server is running on", port)
    })
}

startServer()

