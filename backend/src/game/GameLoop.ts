import { GameRoom } from "./GameRoom"
import { SpinEngine } from "./SpinEngine"
import { generateServerSeed, hashServerSeed } from "./RNG"

export enum RoundState {

  WAITING = "waiting",
  BETTING = "betting",
  SPINNING = "spinning",
  FINISHED = "finished"

}

export class GameLoop {

  private room: GameRoom

  private state: RoundState = RoundState.WAITING

  private bettingDuration = 15000
  private spinDuration = 8000
  private finishDelay = 4000

  private serverSeed = ""
  private serverSeedHash = ""
  private clientSeed = "default-client"
  private nonce = 0

  constructor(room: GameRoom) {

    this.room = room

  }

  /*
  START LOOP
  */

  start() {

    this.startRound()

  }

  /*
  START ROUND
  */

  private startRound() {

    this.state = RoundState.BETTING

    this.serverSeed = generateServerSeed()
    this.serverSeedHash = hashServerSeed(this.serverSeed)

    this.room.broadcast({

      type: "round_start",

      seedHash: this.serverSeedHash,
      bettingTime: this.bettingDuration

    })

    setTimeout(() => {

      this.lockBets()

    }, this.bettingDuration)

  }

  /*
  LOCK BETS
  */

  private lockBets() {

    this.state = RoundState.SPINNING

    this.room.lockBets()

    const players = this.room.getPlayers()

    if (players.length === 0) {

      this.restart()

      return

    }

    const spin = SpinEngine.spin(

      players,
      this.serverSeed,
      this.clientSeed,
      this.nonce

    )

    this.room.broadcast({

      type: "spin_start",

      result: spin,
      spinTime: this.spinDuration

    })

    setTimeout(() => {

      this.finishRound(spin.winnerId)

    }, this.spinDuration)

  }

  /*
  FINISH ROUND
  */

  private finishRound(winnerId: string) {

    this.state = RoundState.FINISHED

    const prize = this.room.calculateBank()

    this.room.broadcast({

      type: "round_result",

      winnerId,
      prize,

      serverSeed: this.serverSeed,
      clientSeed: this.clientSeed,
      nonce: this.nonce

    })

    this.room.reset()

    this.nonce++

    setTimeout(() => {

      this.restart()

    }, this.finishDelay)

  }

  /*
  RESTART
  */

  private restart() {

    this.startRound()

  }

}
