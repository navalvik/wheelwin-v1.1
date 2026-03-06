const canvas=document.getElementById("wheel")
const ctx=canvas.getContext("2d")

const sectors=[

"x2",
"x3",
"x5",
"x10",
"x20",
"x50",
"x100",
"JACKPOT"

]

let rotation=0
let velocity=0

function drawWheel(){

const arc=(Math.PI*2)/sectors.length

ctx.clearRect(0,0,400,400)

sectors.forEach((s,i)=>{

ctx.beginPath()

ctx.fillStyle=i%2?"#2563eb":"#16a34a"

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
ctx.font="18px Arial"

ctx.fillText(s,170,50)

})

}

function animate(){

rotation+=velocity

ctx.save()

ctx.translate(200,200)
ctx.rotate(rotation)
ctx.translate(-200,-200)

drawWheel()

ctx.restore()

requestAnimationFrame(animate)

}

animate()

function spinWheel(result){

velocity=0.3

let slow=setInterval(()=>{

velocity*=0.97

if(velocity<0.001){

velocity=0

clearInterval(slow)

}

},50)

}
