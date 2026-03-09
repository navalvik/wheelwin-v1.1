import { Socket, Server } from "socket.io"
import { RoomManager } from "../game/RoomManager"
import { GameRoom } from "../game/GameRoom"

export class MessageHandler {

  private io: Server
  private roomManager: RoomManager

  constructor(io: Server, roomManager: RoomManager) {

    this.io = io
    this.roomManager = roomManager

  }

  /*
  REGISTER SOCKET EVENTS
  */

  register(socket: Socket) {

    socket.on("join_room", (data) =>
      this.handleJoinRoom(socket, data)
    )

    socket.on("place_bet", (data) =>
      this.handlePlaceBet(socket, data)
    )

    socket.on("leave_room", (data) =>
      this.handleLeaveRoom(socket, data)
    )

  }

  /*
  JOIN ROOM
  */

  private handleJoinRoom(socket: Socket, data: any) {

    const { roomId, playerId } = data

    if (!roomId || !playerId) {

      socket.emit("error", {
        message: "Invalid join request"
      })

      return

    }

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

    socket.emit("joined_room", {

      roomId,
      players: room.getPlayers()

    })

    this.io.to(roomId).emit("player_joined", {

      playerId

    })

  }

  /*
  PLACE BET
  */

  private handlePlaceBet(socket: Socket, data: any) {

    const { roomId, playerId, amount } = data

    if (!roomId || !playerId || !amount) {

      socket.emit("error", {
        message: "Invalid bet"
      })

      return

    }

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

  }

  /*
  LEAVE ROOM
  */

  private handleLeaveRoom(socket: Socket, data: any) {

    const { roomId, playerId } = data

    const room = this.roomManager.getRoom(roomId)

    if (!room) return

    room.removePlayer(playerId)

    socket.leave(roomId)

    this.io.to(roomId).emit("player_left", {

      playerId

    })

  }

}
