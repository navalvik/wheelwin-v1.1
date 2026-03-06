const socket = io()

const readyBtn = document.getElementById("readyBtn")
const spinBtn = document.getElementById("spinBtn")
const playersDiv = document.getElementById("players")
const statusDiv = document.getElementById("status")

let players = []
let readyList = []

readyBtn.onclick = () => {

socket.emit("player_ready")

}

spinBtn.onclick = () => {

socket.emit("spin_wheel")

}

socket.on("players_update", data => {

players = data

renderPlayers()

})

socket.on("ready_update", data => {

readyList = data

renderPlayers()

})

socket.on("game_start", () => {

statusDiv.innerText = "Game Started"

})

socket.on("spin_result", index => {

spinWheel(index)

})
