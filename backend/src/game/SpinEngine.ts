import { pickWinner, PlayerEntry } from "./RNG"

export interface SpinResult {
  winnerId: string
  winnerIndex: number
  roll: number
  stopAngle: number
  sectors: Sector[]
}

export interface Sector {
  playerId: string
  startAngle: number
  endAngle: number
  tickets: number
}

export class SpinEngine {

  /*
  BUILD SECTORS
  */

  static buildSectors(players: PlayerEntry[]): Sector[] {

    const totalTickets = players.reduce(
      (sum, p) => sum + p.tickets,
      0
    )

    let currentAngle = 0

    const sectors: Sector[] = []

    for (const player of players) {

      const portion = player.tickets / totalTickets

      const angleSize = portion * Math.PI * 2

      const sector: Sector = {

        playerId: player.id,
        tickets: player.tickets,
        startAngle: currentAngle,
        endAngle: currentAngle + angleSize

      }

      sectors.push(sector)

      currentAngle += angleSize

    }

    return sectors

  }

  /*
  FIND SECTOR INDEX
  */

  static findWinnerIndex(
    sectors: Sector[],
    winnerId: string
  ): number {

    return sectors.findIndex(
      s => s.playerId === winnerId
    )

  }

  /*
  CALCULATE STOP ANGLE
  */

  static calculateStopAngle(sector: Sector): number {

    const center =
      (sector.startAngle + sector.endAngle) / 2

    const spins = 6 * Math.PI * 2

    return spins + center

  }

  /*
  SPIN
  */

  static spin(
    players: PlayerEntry[],
    serverSeed: string,
    clientSeed: string,
    nonce: number
  ): SpinResult {

    if (players.length === 0) {
      throw new Error("No players in room")
    }

    const sectors = this.buildSectors(players)

    const winner = pickWinner(
      players,
      serverSeed,
      clientSeed,
      nonce
    )

    const winnerIndex = this.findWinnerIndex(
      sectors,
      winner.id
    )

    const sector = sectors[winnerIndex]

    const stopAngle =
      this.calculateStopAngle(sector)

    return {

      winnerId: winner.id,
      winnerIndex,
      roll: Math.random(),
      stopAngle,
      sectors

    }

  }

}
