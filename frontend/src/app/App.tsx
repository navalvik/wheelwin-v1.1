import React, { useEffect, useState } from "react"
import WebApp from "@twa-dev/sdk"

import WheelCanvas from "../components/WheelCanvas"
import PlayerPanel from "../components/PlayerPanel"
import Banner from "../components/Banner"

import { connectSocket, socket } from "../game/socket"
import { useGameRoom } from "../hooks/useGameRoom"

import { TonConnectButton } from "@tonconnect/ui-react"

import "../styles/main.css"


type Player = {
  id: string
  name: string
  avatar?: string
  ready: boolean
}

type Sector = {
  playerId: string
  color: string
  avatar?: string
}

export default function App() {

  const [players, setPlayers] = useState<Player[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [connected, setConnected] = useState(false)

  const game = useGameRoom()

  /*
  TELEGRAM INIT
  */

  useEffect(() => {

    WebApp.ready()
    WebApp.expand()

  }, [])


  /*
  SOCKET INIT
  */

  useEffect(() => {

    connectSocket()

    socket.onopen = () => {
      setConnected(true)

      socket.send(JSON.stringify({
        type: "join_room"
      }))
    }

    socket.onmessage = (msg) => {

      const data = JSON.parse(msg.data)

      switch (data.type) {

        case "room_state":

          setPlayers(data.players)
          setSectors(data.sectors)

          break

        case "spin_start":

          game.startSpin(data)

          break

        case "spin_update":

          game.updateSpin(data)

          break

        case "spin_stop":

          game.stopSpin(data)

          break

        case "payout":

          game.showWinner(data)

          break
      }
    }

  }, [])


  /*
  PLAYER ACTIONS
  */

  const handleReady = () => {

    socket.send(JSON.stringify({
      type: "ready"
    }))

  }


  const handlePress = () => {

    socket.send(JSON.stringify({
      type: "press"
    }))

  }


  const handleRelease = () => {

    socket.send(JSON.stringify({
      type: "release"
    }))

  }


  /*
  UI
  */

  return (

    <div className="app">

      {/* TOP BANNER */}

      <div className="banner-area">
        <Banner />
      </div>


      {/* TON CONNECT */}

      <div className="wallet">

        <TonConnectButton />

      </div>


      {/* WHEEL */}

      <div className="wheel-area">

        <WheelCanvas
          sectors={sectors}
          angle={game.angle}
        />

      </div>


      {/* PLAYER PANEL */}

      <div className="players-area">

        <PlayerPanel
          players={players}
          onReady={handleReady}
          onPress={handlePress}
          onRelease={handleRelease}
          gameState={game.state}
        />

      </div>


      {/* CONNECTION STATUS */}

      {!connected && (

        <div className="connection">

          Connecting to server...

        </div>

      )}

    </div>

  )

}
