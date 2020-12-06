var db=require('../config/connection')
var collection=require('../config/collections') 
const bcrypt=require('bcrypt')
const { response } = require('express')
module.exports={
    doSignup:(UserData)=>{
        return new Promise(async(resolve,reject)=>{
            UserData.Password=await bcrypt.hash(UserData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(UserData).then((data)=>{
                resolve(data.ops[0])
            })
           
        })
        

    },
    doLogin:(UserData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false;
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:UserData.Email})
            if(user){
                bcrypt.compare(UserData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('login success')
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }

                })
            }else{
                console.log('not a user')
            }
        })
    }
}