export enum BetStatus {
  PENDING = "pending",
  LOST = "lost",
  WON = "won"
}

export interface BetData {
  id: string
  playerId: string
  roomId: string
  roundId: number
  amount: number
  createdAt?: number
}

export class Bet {

  id: string
  playerId: string
  roomId: string
  roundId: number

  amount: number
  status: BetStatus

  createdAt: number

  constructor(data: BetData) {

    this.id = data.id
    this.playerId = data.playerId
    this.roomId = data.roomId
    this.roundId = data.roundId

    this.amount = data.amount

    this.status = BetStatus.PENDING

    this.createdAt = data.createdAt || Date.now()

  }

  /*
  MARK AS WON
  */

  win() {

    this.status = BetStatus.WON

  }

  /*
  MARK AS LOST
  */

  lose() {

    this.status = BetStatus.LOST

  }

  /*
  SERIALIZE
  */

  toJSON() {

    return {

      id: this.id,
      playerId: this.playerId,
      roomId: this.roomId,

      roundId: this.roundId,

      amount: this.amount,
      status: this.status,

      createdAt: this.createdAt

    }

  }

}
