import { Pool, QueryResult } from "pg"

const pool = new Pool({

  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "roulette_db",

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000

})

/*
UNIVERSAL QUERY
*/

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {

  const start = Date.now()

  const res = await pool.query(text, params)

  const duration = Date.now() - start

  if (duration > 500) {

    console.warn("slow query:", {
      text,
      duration
    })

  }

  return res

}

/*
PLAYER MODEL
*/

export interface Player {

  id: string
  username?: string
  balance: number

}

/*
GET PLAYER
*/

export async function getPlayer(
  playerId: string
): Promise<Player | null> {

  const res = await query<Player>(

    `
    SELECT id, username, balance
    FROM players
    WHERE id = $1
    `,
    [playerId]

  )

  return res.rows[0] || null

}

/*
CREATE PLAYER
*/

export async function createPlayer(
  playerId: string,
  username?: string
): Promise<Player> {

  const res = await query<Player>(

    `
    INSERT INTO players (id, username, balance)
    VALUES ($1, $2, 0)
    RETURNING id, username, balance
    `,
    [playerId, username]

  )

  return res.rows[0]

}

/*
UPDATE BALANCE
*/

export async function updateBalance(
  playerId: string,
  amount: number
) {

  await query(

    `
    UPDATE players
    SET balance = balance + $1
    WHERE id = $2
    `,
    [amount, playerId]

  )

}

/*
CREATE TRANSACTION
*/

export async function createTransaction(

  playerId: string,
  amount: number,
  type: string

) {

  await query(

    `
    INSERT INTO transactions
    (player_id, amount, type, created_at)

    VALUES ($1, $2, $3, NOW())
    `,
    [playerId, amount, type]

  )

}

/*
GET PLAYER TRANSACTIONS
*/

export async function getPlayerTransactions(
  playerId: string
) {

  const res = await query(

    `
    SELECT *
    FROM transactions
    WHERE player_id = $1
    ORDER BY created_at DESC
    LIMIT 50
    `,
    [playerId]

  )

  return res.rows

}

/*
EXPORT POOL (если нужен напрямую)
*/

export { pool }
