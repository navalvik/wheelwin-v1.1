import React from "react"

type PlayerState =
  | "ready"
  | "waiting"
  | "pressed"

type Player = {
  id: string
  name: string
  avatar?: string
  state: PlayerState
  isSelf?: boolean
}

type Props = {
  players: Player[]
  gameState: string

  onReady: () => void
  onPress: () => void
  onRelease: () => void
}

export default function PlayerPanel({
  players,
  gameState,
  onReady,
  onPress,
  onRelease
}: Props) {

  return (

    <div className="player-panel">

      {players.map(player => (

        <div
          key={player.id}
          className="player-slot"
        >

          {/* AVATAR */}

          <div className="avatar">

            {player.avatar
              ? <img src={player.avatar}/>
              : <div className="avatar-placeholder"/>
            }

          </div>


          {/* PLAYER NAME */}

          <div className="player-name">

            {player.name}

          </div>


          {/* CONTROL BUTTON */}

          {player.isSelf ? (

            <PlayerControlButton
              state={player.state}
              gameState={gameState}
              onReady={onReady}
              onPress={onPress}
              onRelease={onRelease}
            />

          ) : (

            <PlayerIndicator state={player.state}/>

          )}

        </div>

      ))}

    </div>

  )

}



/*
PLAYER BUTTON (SELF)
*/

type ButtonProps = {

  state: PlayerState
  gameState: string

  onReady: () => void
  onPress: () => void
  onRelease: () => void
}

function PlayerControlButton({
  state,
  gameState,
  onReady,
  onPress,
  onRelease
}: ButtonProps) {

  let color = "#777"

  if (state === "ready") color = "#2ecc71"
  if (state === "waiting") color = "#f1c40f"
  if (state === "pressed") color = "#e74c3c"

  /*
  HANDLERS
  */

  const handleMouseDown = () => {

    if (gameState !== "spin") return

    onPress()

  }

  const handleMouseUp = () => {

    if (gameState !== "spin") return

    onRelease()

  }

  const handleReady = () => {

    if (gameState !== "lobby") return

    onReady()

  }

  /*
  BUTTON
  */

  return (

    <button
      className="player-button"
      style={{ background: color }}

      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}

      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}

      onClick={handleReady}
    >

      {gameState === "lobby"
        ? "READY"
        : "SPIN"}

    </button>

  )

}



/*
OTHER PLAYER INDICATOR
*/

function PlayerIndicator({ state }: { state: PlayerState }) {

  let color = "#777"

  if (state === "ready") color = "#2ecc71"
  if (state === "waiting") color = "#f1c40f"
  if (state === "pressed") color = "#e74c3c"

  return (

    <div
      className="player-indicator"
      style={{ background: color }}
    />

  )

}
