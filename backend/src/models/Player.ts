export interface PlayerData {

  id: string
  socketId: string

  username?: string
  avatar?: string

  balance: number
  tickets: number

}

/*
PLAYER CLASS
*/

export class Player {

  id: string
  socketId: string

  username?: string
  avatar?: string

  balance: number
  tickets: number

  constructor(data: PlayerData) {

    this.id = data.id
    this.socketId = data.socketId

    this.username = data.username
    this.avatar = data.avatar

    this.balance = data.balance || 0
    this.tickets = data.tickets || 0

  }

  /*
  ADD BET
  */

  placeBet(amount: number) {

    if (amount <= 0) {
      throw new Error("Invalid bet")
    }

    if (this.balance < amount) {
      throw new Error("Insufficient balance")
    }

    this.balance -= amount

    this.tickets += amount

  }

  /*
  ADD WIN
  */

  addWin(amount: number) {

    this.balance += amount

  }

  /*
  RESET ROUND
  */

  resetRound() {

    this.tickets = 0

  }

  /*
  UPDATE SOCKET
  */

  setSocket(socketId: string) {

    this.socketId = socketId

  }

  /*
  SERIALIZE FOR CLIENT
  */

  toJSON() {

    return {

      id: this.id,
      username: this.username,
      avatar: this.avatar,

      balance: this.balance,
      tickets: this.tickets

    }

  }

}
