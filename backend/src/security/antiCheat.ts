interface BetRecord {
  timestamp: number
}

interface PlayerSecurityState {
  bets: BetRecord[]
  lastMessage: number
  suspiciousScore: number
}

export class AntiCheat {

  private playerStates: Map<string, PlayerSecurityState> = new Map()

  private MAX_BETS_PER_SECOND = 5
  private MESSAGE_COOLDOWN = 50
  private MIN_BET = 1
  private MAX_BET = 10000

  /*
  GET OR CREATE STATE
  */

  private getState(playerId: string): PlayerSecurityState {

    if (!this.playerStates.has(playerId)) {

      this.playerStates.set(playerId, {

        bets: [],
        lastMessage: 0,
        suspiciousScore: 0

      })

    }

    return this.playerStates.get(playerId)!

  }

  /*
  RATE LIMIT MESSAGES
  */

  checkMessageRate(playerId: string): boolean {

    const state = this.getState(playerId)

    const now = Date.now()

    if (now - state.lastMessage < this.MESSAGE_COOLDOWN) {

      state.suspiciousScore++

      return false

    }

    state.lastMessage = now

    return true

  }

  /*
  VALIDATE BET AMOUNT
  */

  validateBetAmount(amount: number): boolean {

    if (amount < this.MIN_BET) return false

    if (amount > this.MAX_BET) return false

    return true

  }

  /*
  BET RATE LIMIT
  */

  checkBetRate(playerId: string): boolean {

    const state = this.getState(playerId)

    const now = Date.now()

    state.bets.push({
      timestamp: now
    })

    state.bets = state.bets.filter(

      bet => now - bet.timestamp < 1000

    )

    if (state.bets.length > this.MAX_BETS_PER_SECOND) {

      state.suspiciousScore++

      return false

    }

    return true

  }

  /*
  FRAUD SCORE
  */

  getSuspicionScore(playerId: string): number {

    const state = this.getState(playerId)

    return state.suspiciousScore

  }

  /*
  IS PLAYER BLOCKED
  */

  isBlocked(playerId: string): boolean {

    const score = this.getSuspicionScore(playerId)

    return score > 20

  }

  /*
  RESET PLAYER
  */

  resetPlayer(playerId: string) {

    this.playerStates.delete(playerId)

  }

}
