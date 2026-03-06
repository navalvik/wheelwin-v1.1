const canvas = document.getElementById("wheel")
const ctx = canvas.getContext("2d")

const sectors = [

"x2",
"x3",
"x5",
"x10",
"x20",
"x50",
"x100",
"JACKPOT"

]

let angle = 0

function drawWheel(){

const arc = (Math.PI*2)/sectors.length

ctx.clearRect(0,0,400,400)

sectors.forEach((s,i)=>{

ctx.beginPath()

ctx.fillStyle = i%2 ? "#2563eb" : "#16a34a"

ctx.moveTo(200,200)

ctx.arc(

200,
200,
200,
i*arc,
(i+1)*arc

)

ctx.fill()

ctx.fillStyle="white"

ctx.fillText(s,180,50)

})

}

drawWheel()

function spinWheel(result){

let target = result * (Math.PI*2/sectors.length)

let speed = 0.3

let interval = setInterval(()=>{

angle += speed

speed *= 0.99

ctx.save()

ctx.translate(200,200)
ctx.rotate(angle)
ctx.translate(-200,-200)

drawWheel()

ctx.restore()

if(speed < 0.002){

clearInterval(interval)

}

},16)

}
