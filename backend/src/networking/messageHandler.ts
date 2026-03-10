import { Socket } from "socket.io"
import { RoomManager } from "../game/RoomManager"
import { AntiCheat } from "../security/antiCheat"

const roomManager = new RoomManager()
const antiCheat = new AntiCheat()

export function registerMessageHandlers(socket: Socket) {

  let currentRoomId: string | null = null
  let playerId: string | null = null

  /*
  JOIN ROOM
  */

  socket.on("join_room", ({ roomId, id, username }) => {

    playerId = id
    currentRoomId = roomId

    const room = roomManager.getOrCreateRoom(roomId)

    const player = roomManager.addPlayerToRoom(
      roomId,
      playerId,
      socket.id,
      username
    )

    socket.join(roomId)

    /*
    SEND FULL ROOM STATE
    */

    socket.emit("room_update", room.getStats())

    socket.to(roomId).emit("players_update", room.getPlayers())

  })

  /*
  PLACE BET
  */

  socket.on("place_bet", ({ amount }) => {

    if (!playerId || !currentRoomId) return

    if (!antiCheat.checkMessageRate(playerId)) return
    if (!antiCheat.validateBetAmount(amount)) return
    if (!antiCheat.checkBetRate(playerId)) return

    const room = roomManager.getRoom(currentRoomId)
    if (!room) return

    try {

      room.placeBet(playerId, amount)

      /*
      UPDATE PLAYERS + BANK
      */

      const payload = {

        players: room.getPlayers(),
        bank: room.getBank(),
        roundId: room.roundId

      }

      socket.to(currentRoomId).emit("room_update", payload)
      socket.emit("room_update", payload)

    } catch (err) {

      socket.emit("error", {
        message: (err as Error).message
      })

    }

  })

  /*
  START SPIN
  */

  socket.on("start_spin", () => {

    if (!currentRoomId) return

    const room = roomManager.getRoom(currentRoomId)
    if (!room) return

    room.startSpin()

    const activePlayers = room.getPlayers().length

    const baseSpeed = 1
    const speed = Math.min(baseSpeed * activePlayers, 4)

    /*
    BROADCAST SPIN START
    */

    socket.to(currentRoomId).emit("spin_start", {
      speed
    })

    socket.emit("spin_start", {
      speed
    })

  })

  /*
  SPIN RESULT
  */

  socket.on("spin_result", ({ winnerId }) => {

    if (!currentRoomId) return

    const room = roomManager.getRoom(currentRoomId)
    if (!room) return

    const bank = room.getBank()

    const houseEdge = 0.05

    const prize = bank * (1 - houseEdge)

    room.finishRound()

    /*
    SEND RESULT
    */

    socket.to(currentRoomId).emit("spin_result", {

      winnerId,
      prize

    })

    socket.emit("spin_result", {

      winnerId,
      prize

    })

    /*
    RESET ROOM
    */

    setTimeout(() => {

      room.resetRound()

      socket.to(currentRoomId!).emit(
        "room_update",
        room.getStats()
      )

      socket.emit(
        "room_update",
        room.getStats()
      )

    }, 3000)

  })

  /*
  DISCONNECT
  */

  socket.on("disconnect", () => {

    if (!currentRoomId || !playerId) return

    const room = roomManager.getRoom(currentRoomId)

    if (!room) return

    room.removePlayer(playerId)

    socket.to(currentRoomId).emit(
      "players_update",
      room.getPlayers()
    )

  })

}
