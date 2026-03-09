import { WebSocket } from "ws"
import GameRoom from "./GameRoom"
import { v4 as uuidv4 } from "uuid"

type PlayerConnection = {
  playerId: string
  ws: WebSocket
}

export default class RoomManager {

  rooms: Map<string, GameRoom> = new Map()

  playerRoom: Map<string, string> = new Map()

  maxPlayersPerRoom = 5

  /*
  JOIN ROOM
  */

  joinRoom(ws: WebSocket, playerId: string) {

    let room = this.findAvailableRoom()

    if (!room) {

      room = this.createRoom()

    }

    room.addPlayer(ws, playerId)

    this.playerRoom.set(playerId, room.id)

  }

  /*
  CREATE ROOM
  */

  createRoom(): GameRoom {

    const roomId = uuidv4()

    const room = new GameRoom(roomId)

    this.rooms.set(roomId, room)

    console.log("Room created:", roomId)

    return room

  }

  /*
  FIND ROOM
  */

  findAvailableRoom(): GameRoom | null {

    for (const room of this.rooms.values()) {

      if (
        room.players.length < this.maxPlayersPerRoom &&
        room.state === "lobby"
      ) {

        return room

      }

    }

    return null

  }

  /*
  PLAYER READY
  */

  playerReady(playerId: string) {

    const room = this.getPlayerRoom(playerId)

    if (!room) return

    room.playerReady(playerId)

  }

  /*
  PRESS
  */

  press(playerId: string) {

    const room = this.getPlayerRoom(playerId)

    if (!room) return

    room.press(playerId)

  }

  /*
  RELEASE
  */

  release(playerId: string) {

    const room = this.getPlayerRoom(playerId)

    if (!room) return

    room.release(playerId)

  }

  /*
  PLAYER LEAVE
  */

  removePlayer(playerId: string) {

    const room = this.getPlayerRoom(playerId)

    if (!room) return

    room.removePlayer(playerId)

    this.playerRoom.delete(playerId)

    if (room.players.length === 0) {

      this.removeRoom(room.id)

    }

  }

  /*
  GET ROOM
  */

  getPlayerRoom(playerId: string): GameRoom | null {

    const roomId = this.playerRoom.get(playerId)

    if (!roomId) return null

    const room = this.rooms.get(roomId)

    return room || null

  }

  /*
  REMOVE ROOM
  */

  removeRoom(roomId: string) {

    this.rooms.delete(roomId)

    console.log("Room removed:", roomId)

  }

}
