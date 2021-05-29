const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    const url="mongodb+srv://book1234:book2021@cluster0.y2gry.mongodb.net/shoppingcart"
    const dbname="shoppingcart"

    mongoClient.connect(url,(err,data)=> {
        { useUnifiedTopology: true } 
      if(err) return done(err)
      state.db=data.db(dbname)
      done()

    })



}


module.exports.get=()=>{
    return state.db
}