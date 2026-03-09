import { Player } from "./Player"

export enum RoomState {
  WAITING = "waiting",
  BETTING = "betting",
  SPINNING = "spinning",
  FINISHED = "finished"
}

export interface RoomOptions {
  id: string
  minBet?: number
  maxPlayers?: number
}

export class Room {

  id: string
  players: Map<string, Player>

  state: RoomState

  minBet: number
  maxPlayers: number

  roundBank: number
  roundId: number

  createdAt: number

  constructor(options: RoomOptions) {

    this.id = options.id

    this.players = new Map()

    this.state = RoomState.WAITING

    this.minBet = options.minBet || 1
    this.maxPlayers = options.maxPlayers || 50

    this.roundBank = 0
    this.roundId = 1

    this.createdAt = Date.now()

  }

  /*
  ADD PLAYER
  */

  addPlayer(player: Player) {

    if (this.players.size >= this.maxPlayers) {
      throw new Error("Room full")
    }

    this.players.set(player.id, player)

  }

  /*
  REMOVE PLAYER
  */

  removePlayer(playerId: string) {

    this.players.delete(playerId)

  }

  /*
  GET PLAYER
  */

  getPlayer(playerId: string): Player | undefined {

    return this.players.get(playerId)

  }

  /*
  GET ALL PLAYERS
  */

  getPlayers(): Player[] {

    return Array.from(this.players.values())

  }

  /*
  PLACE BET
  */

  placeBet(playerId: string, amount: number) {

    if (this.state !== RoomState.BETTING) {
      throw new Error("Betting closed")
    }

    if (amount < this.minBet) {
      throw new Error("Bet below minimum")
    }

    const player = this.players.get(playerId)

    if (!player) {
      throw new Error("Player not found")
    }

    player.placeBet(amount)

    this.roundBank += amount

  }

  /*
  TOTAL BANK
  */

  getBank(): number {

    return this.roundBank

  }

  /*
  START ROUND
  */

  startRound() {

    this.state = RoomState.BETTING

    this.roundBank = 0

    for (const player of this.players.values()) {
      player.resetRound()
    }

  }

  /*
  START SPIN
  */

  startSpin() {

    this.state = RoomState.SPINNING

  }

  /*
  FINISH ROUND
  */

  finishRound() {

    this.state = RoomState.FINISHED

    this.roundId++

  }

  /*
  RESET AFTER ROUND
  */

  resetRound() {

    this.roundBank = 0

    for (const player of this.players.values()) {
      player.resetRound()
    }

    this.state = RoomState.WAITING

  }

  /*
  ROOM STATS
  */

  getStats() {

    return {

      id: this.id,
      players: this.players.size,
      bank: this.roundBank,
      state: this.state,
      roundId: this.roundId

    }

  }

}
