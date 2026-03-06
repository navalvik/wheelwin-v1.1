function renderPlayers(){

playersDiv.innerHTML=""

players.forEach(p=>{

const div=document.createElement("div")

div.className="player"

let status = readyList.includes(p.id) ? "READY" : "WAIT"

div.innerText = p.name + " - " + status

playersDiv.appendChild(div)

})

}
