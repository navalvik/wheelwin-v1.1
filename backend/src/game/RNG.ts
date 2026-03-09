import crypto from "crypto"

/*
PLAYER TYPE
*/

export interface PlayerEntry {

  id: string
  tickets: number

}


/*
HASH UTILS
*/

export function sha256(data: string): string {

  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")

}


/*
RANDOM FLOAT 0..1
*/

export function randomFloatFromSeed(seed: string): number {

  const hash = sha256(seed)

  const slice = hash.slice(0, 13)

  const int = parseInt(slice, 16)

  const max = 0xFFFFFFFFFFFFF

  return int / max

}


/*
PROVABLY FAIR RESULT
*/

export function provablyFairRoll(
  serverSeed: string,
  clientSeed: string,
  nonce: number
): number {

  const seed = `${serverSeed}:${clientSeed}:${nonce}`

  return randomFloatFromSeed(seed)

}


/*
PICK WINNER
*/

export function pickWinner(
  players: PlayerEntry[],
  serverSeed: string,
  clientSeed: string,
  nonce: number
): PlayerEntry {

  const roll = provablyFairRoll(serverSeed, clientSeed, nonce)

  const totalTickets = players.reduce(
    (sum, p) => sum + p.tickets,
    0
  )

  const target = roll * totalTickets

  let cumulative = 0

  for (const player of players) {

    cumulative += player.tickets

    if (target <= cumulative) {

      return player

    }

  }

  return players[players.length - 1]

}


/*
GENERATE SERVER SEED
*/

export function generateServerSeed(): string {

  return crypto
    .randomBytes(32)
    .toString("hex")

}


/*
HASH SERVER SEED
*/

export function hashServerSeed(seed: string): string {

  return sha256(seed)

}
