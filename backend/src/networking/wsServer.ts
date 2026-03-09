import { Server } from "socket.io"
import http from "http"

import { RoomManager } from "../game/RoomManager"
import { GameRoom } from "../game/GameRoom"

export class WSServer {

  private io: Server
  private roomManager: RoomManager

  constructor(server: http.Server, roomManager: RoomManager) {

    this.roomManager = roomManager

    this.io = new Server(server, {

      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }

    })

  }

  /*
  START SOCKET SERVER
  */

  start() {

    this.io.on("connection", (socket) => {

      console.log("client connected:", socket.id)

      /*
      JOIN ROOM
      */

      socket.on("join_room", (data) => {

        const { roomId, playerId } = data

        const room: GameRoom | undefined =
          this.roomManager.getRoom(roomId)

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

        socket.emit("room_joined", {

          roomId,
          players: room.getPlayers()

        })

        this.io.to(roomId).emit("player_joined", {

          playerId

        })

      })

      /*
      PLACE BET
      */

      socket.on("place_bet", (data) => {

        const { roomId, playerId, amount } = data

        const room = this.roomManager.getRoom(roomId)

        if (!room) return

        try {

          room.placeBet(playerId, amount)

          this.io.to(roomId).emit("player_bet", {

            playerId,
            amount

          })

        } catch (err) {

          socket.emit("error", {

            message: "Bet rejected"

          })

        }

      })

      /*
      LEAVE ROOM
      */

      socket.on("leave_room", (data) => {

        const { roomId, playerId } = data

        const room = this.roomManager.getRoom(roomId)

        if (!room) return

        room.removePlayer(playerId)

        socket.leave(roomId)

        this.io.to(roomId).emit("player_left", {

          playerId

        })

      })

      /*
      DISCONNECT
      */

      socket.on("disconnect", () => {

        console.log("client disconnected:", socket.id)

        this.roomManager.removePlayerBySocket(socket.id)

      })

    })

  }

  /*
  BROADCAST TO ROOM
  */

  broadcastToRoom(roomId: string, event: string, data: any) {

    this.io.to(roomId).emit(event, data)

  }

}
