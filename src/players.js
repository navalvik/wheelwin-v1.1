class PlayerManager{

constructor(){

this.players=[]

}

add(player){

this.players.push(player)

}

remove(id){

this.players=this.players.filter(p=>p.id!==id)

}

getAll(){

return this.players

}

}

module.exports=PlayerManager
