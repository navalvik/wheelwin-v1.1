const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let players = []
let readyPlayers = new Set()

let gameState = {

running:false,
speed:1,
buttonPress:{},
timer:0

}

function broadcastState(){

io.emit("game_state", gameState)

}

io.on("connection", socket=>{

const player={

id:socket.id,
name:"Player-"+Math.floor(Math.random()*9999)

}

players.push(player)

io.emit("players_update",players)

socket.on("player_ready",()=>{

readyPlayers.add(socket.id)

io.emit("ready_update",Array.from(readyPlayers))

})

socket.on("spin_press",()=>{

if(!gameState.running) return

if(!gameState.buttonPress[socket.id]){

gameState.buttonPress[socket.id]=true

gameState.speed*=2

broadcastState()

}

})

socket.on("spin_release",()=>{

if(!gameState.running) return

if(gameState.buttonPress[socket.id]){

gameState.buttonPress[socket.id]=false

gameState.speed/=2

broadcastState()

}

})

socket.on("start_round",()=>{

if(players.length<2) return

if(readyPlayers.size!==players.length) return

gameState.running=true
gameState.speed=1
gameState.timer=5
gameState.buttonPress={}

broadcastState()

startTimer()

})

socket.on("disconnect",()=>{

players=players.filter(p=>p.id!==socket.id)

readyPlayers.delete(socket.id)

delete gameState.buttonPress[socket.id]

io.emit("players_update",players)

})

})

function startTimer(){

let interval=setInterval(()=>{

gameState.timer--

broadcastState()

if(gameState.timer<=0){

clearInterval(interval)

finishRound()

}

},1000)

}

function finishRound(){

gameState.running=false

const result=Math.floor(Math.random()*8)

io.emit("round_result",result)

readyPlayers.clear()

}

server.listen(3000,()=>{

console.log("WheelWin-v1.1 PRO server running")

})
