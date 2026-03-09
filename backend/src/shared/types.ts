/*
COMMON TYPES USED ACROSS BACKEND AND FRONTEND
*/

export type ID = string

/*
PLAYER
*/

export interface PlayerDTO {

  id: ID
  username?: string
  avatar?: string

  balance: number
  tickets: number

}

/*
ROOM
*/

export interface RoomDTO {

  id: ID
  state: RoomState

  players: PlayerDTO[]

  bank: number
  roundId: number

}

/*
BET
*/

export interface BetDTO {

  id: ID
  playerId: ID
  roomId: ID

  roundId: number
  amount: number

  status: BetStatus
  createdAt: number

}

/*
ROUND
*/

export interface RoundDTO {

  id: number
  roomId: ID

  bank: number
  winnerId?: ID

  startedAt: number
  finishedAt?: number

}

/*
SPIN RESULT
*/

export interface SpinResultDTO {

  winnerId: ID
  winnerIndex: number

  stopAngle: number

}

/*
ENUMS
*/

export enum RoomState {

  WAITING = "waiting",
  BETTING = "betting",
  SPINNING = "spinning",
  FINISHED = "finished"

}

export enum BetStatus {

  PENDING = "pending",
  WON = "won",
  LOST = "lost"

}

/*
WEBSOCKET EVENTS
*/

export interface WSJoinRoom {

  roomId: ID
  playerId: ID

}

export interface WSPlaceBet {

  roomId: ID
  playerId: ID
  amount: number

}

export interface WSLeaveRoom {

  roomId: ID
  playerId: ID

}

/*
SERVER EVENTS
*/

export interface WSPlayerJoined {

  playerId: ID

}

export interface WSPlayerLeft {

  playerId: ID

}

export interface WSPlayerBet {

  playerId: ID
  amount: number

}

export interface WSSpinStart {

  result: SpinResultDTO
  spinTime: number

}

export interface WSRoundResult {

  winnerId: ID
  prize: number

  serverSeed: string
  clientSeed: string
  nonce: number

}
