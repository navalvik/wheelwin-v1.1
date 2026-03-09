import { useEffect, useRef, useState } from "react"
import { WheelEngine } from "../game/wheelEngine"

export type GameState =
  | "lobby"
  | "ready"
  | "spin"
  | "stop"
  | "payout"

type SpinStartData = {
  activePlayers: number
}

type SpinUpdateData = {
  angle: number
  speed: number
}

type SpinStopData = {
  finalAngle: number
}

type WinnerData = {
  winnerId: string
}

export function useGameRoom() {

  const engineRef = useRef(new WheelEngine())

  const [angle, setAngle] = useState(0)
  const [state, setState] = useState<GameState>("lobby")

  const animationRef = useRef<number | null>(null)

  /*
  GAME LOOP
  */

  const loop = (time: number) => {

    const engine = engineRef.current

    engine.update(time)

    setAngle(engine.angle)

    animationRef.current = requestAnimationFrame(loop)

  }

  /*
  START LOOP
  */

  const startLoop = () => {

    if (animationRef.current) return

    animationRef.current = requestAnimationFrame(loop)

  }

  /*
  STOP LOOP
  */

  const stopLoop = () => {

    if (animationRef.current) {

      cancelAnimationFrame(animationRef.current)
      animationRef.current = null

    }

  }

  /*
  SPIN START
  */

  const startSpin = (data: SpinStartData) => {

    const engine = engineRef.current

    engine.startSpin(data.activePlayers)

    setState("spin")

    startLoop()

  }

  /*
  SPIN UPDATE (SERVER SYNC)
  */

  const updateSpin = (data: SpinUpdateData) => {

    const engine = engineRef.current

    engine.sync(data.angle, data.speed)

  }

  /*
  SPIN STOP
  */

  const stopSpin = (data: SpinStopData) => {

    const engine = engineRef.current

    engine.startBrake()

    setState("stop")

    engine.angle = data.finalAngle

  }

  /*
  SHOW WINNER
  */

  const showWinner = (data: WinnerData) => {

    setState("payout")

    console.log("Winner:", data.winnerId)

  }

  /*
  PLAYER BOOST
  */

  const boost = () => {

    const engine = engineRef.current

    engine.pressBoost()

  }

  /*
  RESET GAME
  */

  const reset = () => {

    stopLoop()

    engineRef.current = new WheelEngine()

    setAngle(0)

    setState("lobby")

  }

  /*
  CLEANUP
  */

  useEffect(() => {

    return () => {

      stopLoop()

    }

  }, [])

  return {

    angle,
    state,

    startSpin,
    updateSpin,
    stopSpin,
    showWinner,

    boost,
    reset

  }

}
