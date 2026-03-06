class GameLogic{

constructor(){

this.sectors=8

}

randomSector(){

return Math.floor(Math.random()*this.sectors)

}

}

module.exports=GameLogic
