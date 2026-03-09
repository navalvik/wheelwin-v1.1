import http from "http"
import express from "express"
import { Server } from "socket.io"

import { RoomManager } from "./game/RoomManager"
import { GameLoop } from "./game/GameLoop"

const PORT = 3000

/*
EXPRESS APP
*/

const app = express()

app.use(express.json())

app.get("/health", (_, res) => {
  res.json({ status: "ok" })
})

/*
HTTP SERVER
*/

const httpServer = http.createServer(app)

/*
SOCKET SERVER
*/

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

/*
ROOM MANAGER
*/

const roomManager = new RoomManager()

/*
CREATE MAIN ROOM
*/

const mainRoom = roomManager.createRoom("main")

/*
GAME LOOP
*/

const gameLoop = new GameLoop(mainRoom)
gameLoop.start()

/*
SOCKET CONNECTION
*/

io.on("connection", (socket) => {

  console.log("client connected:", socket.id)

  /*
  JOIN ROOM
  */

  socket.on("join_room", (data) => {

    const { playerId, roomId } = data

    const room = roomManager.getRoom(roomId)

    if (!room) {

      socket.emit("error", {
        message: "Room not found"
      })

      return

    }

    socket.join(roomId)

    room.addPlayer({
      id: playerId,
      socketId: socket.id,
      tickets: 0
    })

    socket.emit("joined_room", {
      roomId
    })

  })

  /*
  PLACE BET
  */

  socket.on("place_bet", (data) => {

    const { roomId, playerId, amount } = data

    const room = roomManager.getRoom(roomId)

    if (!room) return

    room.placeBet(playerId, amount)

    io.to(roomId).emit("player_bet", {

      playerId,
      amount

    })

  })

  /*
  DISCONNECT
  */

  socket.on("disconnect", () => {

    console.log("client disconnected:", socket.id)

    roomManager.removePlayerBySocket(socket.id)

  })

})

/*
START SERVER
*/

httpServer.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`)

})
