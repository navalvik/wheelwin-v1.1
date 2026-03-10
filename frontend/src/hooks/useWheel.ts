import { useEffect, useRef, useState } from "react"
import { gameState } from "../game/gameState"

export function useWheel() {

  const [angle, setAngle] = useState(0)

  const animationRef = useRef<number | null>(null)

  const speedRef = useRef(0)

  const lastTimeRef = useRef<number>(0)

  /*
  START ANIMATION LOOP
  */

  const animate = (time: number) => {

    if (!lastTimeRef.current) {
      lastTimeRef.current = time
    }

    const delta = time - lastTimeRef.current

    lastTimeRef.current = time

    const speed = speedRef.current

    const rotation = (speed * delta) / 1000 * 360

    setAngle(prev => (prev + rotation) % 360)

    animationRef.current = requestAnimationFrame(animate)

  }

  /*
  START SPIN
  */

  const startSpin = (speed: number) => {

    speedRef.current = speed

    if (!animationRef.current) {

      animationRef.current = requestAnimationFrame(animate)

    }

  }

  /*
  STOP SPIN
  */

  const stopSpin = () => {

    speedRef.current = 0

    if (animationRef.current) {

      cancelAnimationFrame(animationRef.current)

      animationRef.current = null

    }

  }

  /*
  SMOOTH DECELERATION
  */

  const decelerate = (duration = 3000) => {

    const startSpeed = speedRef.current

    const startTime = performance.now()

    const step = (time: number) => {

      const progress = (time - startTime) / duration

      if (progress >= 1) {

        speedRef.current = 0

        return

      }

      speedRef.current = startSpeed * (1 - progress)

      requestAnimationFrame(step)

    }

    requestAnimationFrame(step)

  }

  /*
  LISTEN GAME STATE
  */

  useEffect(() => {

    const unsubscribe = gameState.subscribe((state) => {

      if (state.spinning) {

        startSpin(state.wheelSpeed)

      } else {

        decelerate()

      }

    })

    return () => {

      unsubscribe()

      stopSpin()

    }

  }, [])

  return {

    angle,

    startSpin,

    stopSpin,

    decelerate

  }

}
