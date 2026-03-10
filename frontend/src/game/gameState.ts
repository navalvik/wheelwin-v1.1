import { PlayerDTO, RoomState } from "../../shared/types"

export interface GameState {

  roomId: string

  state: RoomState

  players: PlayerDTO[]

  bank: number

  roundId: number

  winnerId?: string

  spinning: boolean

  wheelSpeed: number

}

type Listener = (state: GameState) => void

class GameStateManager {

  private state: GameState

  private listeners: Listener[] = []

  constructor() {

    this.state = {

      roomId: "",

      state: RoomState.WAITING,

      players: [],

      bank: 0,

      roundId: 0,

      spinning: false,

      wheelSpeed: 0

    }

  }

  /*
  GET STATE
  */

  getState(): GameState {

    return this.state

  }

  /*
  SUBSCRIBE
  */

  subscribe(listener: Listener) {

    this.listeners.push(listener)

    return () => {

      this.listeners = this.listeners.filter(
        l => l !== listener
      )

    }

  }

  /*
  NOTIFY LISTENERS
  */

  private notify() {

    for (const listener of this.listeners) {

      listener(this.state)

    }

  }

  /*
  UPDATE ROOM
  */

  updateRoom(data: Partial<GameState>) {

    this.state = {

      ...this.state,
      ...data

    }

    this.notify()

  }

  /*
  SET PLAYERS
  */

  setPlayers(players: PlayerDTO[]) {

    this.state.players = players

    this.notify()

  }

  /*
  UPDATE PLAYER
  */

  updatePlayer(playerId: string, data: Partial<PlayerDTO>) {

    this.state.players = this.state.players.map(p => {

      if (p.id !== playerId) return p

      return {

        ...p,
        ...data

      }

    })

    this.notify()

  }

  /*
  START SPIN
  */

  startSpin(speed: number) {

    this.state.spinning = true
    this.state.wheelSpeed = speed

    this.notify()

  }

  /*
  STOP SPIN
  */

  stopSpin(winnerId: string) {

    this.state.spinning = false
    this.state.winnerId = winnerId

    this.notify()

  }

  /*
  RESET ROUND
  */

  resetRound() {

    this.state.winnerId = undefined
    this.state.bank = 0
    this.state.spinning = false
    this.state.wheelSpeed = 0

    this.notify()

  }

}

export const gameState = new GameStateManager()
