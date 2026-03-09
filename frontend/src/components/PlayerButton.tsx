import React from "react"

export type PlayerButtonState =
  | "ready"
  | "waiting"
  | "pressed"

type Props = {

  state: PlayerButtonState

  gameState: string

  onReady?: () => void
  onPress?: () => void
  onRelease?: () => void

  disabled?: boolean
}

export default function PlayerButton({
  state,
  gameState,
  onReady,
  onPress,
  onRelease,
  disabled
}: Props) {

  /*
  COLOR STATE
  */

  const getColor = () => {

    switch (state) {

      case "ready":
        return "#2ecc71"

      case "waiting":
        return "#f1c40f"

      case "pressed":
        return "#e74c3c"

      default:
        return "#888"

    }

  }

  const color = getColor()

  /*
  HANDLERS
  */

  const handleMouseDown = () => {

    if (disabled) return

    if (gameState === "spin") {

      onPress?.()

    }

  }

  const handleMouseUp = () => {

    if (disabled) return

    if (gameState === "spin") {

      onRelease?.()

    }

  }

  const handleClick = () => {

    if (disabled) return

    if (gameState === "lobby") {

      onReady?.()

    }

  }

  /*
  RENDER
  */

  return (

    <button
      className="player-button"
      style={{
        background: color,
        opacity: disabled ? 0.5 : 1
      }}

      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}

      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}

      onClick={handleClick}
    >

      {gameState === "lobby"
        ? "READY"
        : "SPIN"}

    </button>

  )

}
