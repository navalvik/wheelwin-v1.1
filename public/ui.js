const timerDiv=document.createElement("div")
timerDiv.id="timer"

document.body.appendChild(timerDiv)

const speedDiv=document.createElement("div")
speedDiv.id="speed"

document.body.appendChild(speedDiv)

function updateTimer(t){

timerDiv.innerText="TIME: "+t

}

function updateSpeed(s){

speedDiv.innerText="SPEED x"+s

}
