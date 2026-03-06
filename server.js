const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let players = []
let readyPlayers = new Set()
let gameStarted = false

io.on("connection", (socket) => {

    const player = {
        id: socket.id,
        name: "Player-" + Math.floor(Math.random() * 9999)
    }

    players.push(player)

    io.emit("players_update", players)

    socket.on("player_ready", () => {

        readyPlayers.add(socket.id)

        io.emit("ready_update", Array.from(readyPlayers))

        if (readyPlayers.size === players.length && players.length >= 2) {

            gameStarted = true

            io.emit("game_start")

        }

    })

    socket.on("spin_wheel", () => {

        if (!gameStarted) return

        const result = Math.floor(Math.random() * 8)

        io.emit("spin_result", result)

        readyPlayers.clear()
        gameStarted = false

    })

    socket.on("disconnect", () => {

        players = players.filter(p => p.id !== socket.id)
        readyPlayers.delete(socket.id)

        io.emit("players_update", players)

    })

})

server.listen(3000, () => {

    console.log("WheelWin-v1.1 server running")

})
