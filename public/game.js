const readyBtn = document.getElementById("readyBtn")
const spinBtn = document.getElementById("spinBtn")
const statusDiv = document.getElementById("status")
const wheel = document.getElementById("wheel")

let currentSpeed = 1
let roundActive = false
let rotation = 0
let spinInterval = null

// READY
readyBtn.onclick = () => {

    roundActive = true
    statusDiv.innerText = "Player ready"

    readyBtn.style.background = "yellow"

}

// Нажатие SPIN
spinBtn.onmousedown = () => {

    if (!roundActive) return

    currentSpeed *= 2

    statusDiv.innerText = "Speed: " + currentSpeed

    startSpin()

}

// Отпускание SPIN
spinBtn.onmouseup = () => {

    if (!roundActive) return

    currentSpeed = 1

    statusDiv.innerText = "Speed normal"

}

// Запуск вращения
function startSpin() {

    if (spinInterval) return

    spinInterval = setInterval(() => {

        rotation += currentSpeed * 5

        wheel.style.transform = `rotate(${rotation}deg)`

    }, 50)

}

// остановка
function stopSpin() {

    clearInterval(spinInterval)
    spinInterval = null

}
