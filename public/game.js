const socket = io()

const readyBtn = document.getElementById("readyBtn")
const spinBtn = document.getElementById("spinBtn")
const statusDiv = document.getElementById("status")

let currentSpeed=1
let roundActive=false

readyBtn.onclick=()=>{

socket.emit("player_ready")

}

spinBtn.onmousedown=()=>{

socket.emit("spin_press")

}

spinBtn.onmouseup=()=>{

socket.emit("spin_release")

}

socket.on("game_state",state=>{

roundActive=state.running
currentSpeed=state.speed

updateSpeed(state.speed)
updateTimer(state.timer)

})

socket.on("round_result",index=>{

spinWheel(index)

})
