import { createClient } from "redis"

const REDIS_URL =
  process.env.REDIS_URL || "redis://localhost:6379"

/*
MAIN REDIS CLIENT
*/

export const redis = createClient({
  url: REDIS_URL
})

/*
PUB CLIENT
*/

export const redisPub = createClient({
  url: REDIS_URL
})

/*
SUB CLIENT
*/

export const redisSub = createClient({
  url: REDIS_URL
})

/*
CONNECT ALL
*/

export async function connectRedis() {

  redis.on("error", (err) =>
    console.error("Redis error:", err)
  )

  await redis.connect()
  await redisPub.connect()
  await redisSub.connect()

  console.log("Redis connected")

}

/*
CACHE HELPERS
*/

export async function setCache(
  key: string,
  value: any,
  ttl?: number
) {

  const data = JSON.stringify(value)

  if (ttl) {

    await redis.set(key, data, {
      EX: ttl
    })

  } else {

    await redis.set(key, data)

  }

}

export async function getCache<T = any>(
  key: string
): Promise<T | null> {

  const data = await redis.get(key)

  if (!data) return null

  return JSON.parse(data)

}

export async function deleteCache(key: string) {

  await redis.del(key)

}

/*
PLAYER CACHE
*/

export async function cachePlayer(
  playerId: string,
  data: any
) {

  await setCache(
    `player:${playerId}`,
    data,
    300
  )

}

export async function getCachedPlayer(
  playerId: string
) {

  return getCache(`player:${playerId}`)

}

/*
ROOM CACHE
*/

export async function cacheRoom(
  roomId: string,
  data: any
) {

  await setCache(
    `room:${roomId}`,
    data,
    60
  )

}

export async function getCachedRoom(
  roomId: string
) {

  return getCache(`room:${roomId}`)

}

/*
PUB/SUB
*/

export async function publish(
  channel: string,
  message: any
) {

  await redisPub.publish(
    channel,
    JSON.stringify(message)
  )

}

export async function subscribe(
  channel: string,
  handler: (msg: any) => void
) {

  await redisSub.subscribe(
    channel,
    (message) => {

      try {

        const data = JSON.parse(message)

        handler(data)

      } catch {

        handler(message)

      }

    }
  )

}
