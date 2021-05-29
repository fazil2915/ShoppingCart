const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    const url="mongodb://localhost:27017"
    const dbname="shopping"

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