var db=require('../config/connection')
var collection=require('../config/collections') 
const bcrypt=require('bcrypt')
const { response } = require('express')
const { ObjectID } = require('mongodb')
var objctId=require('mongodb').ObjectID
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
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
          let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectID(userId)})
          if(userCart){
              db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectID(userId)},
              {
                  $push:{products:ObjectID(proId)}
              }
              ).then((response)=>{
                  resolve()
              })
          }else{
              let cartObj={
                  user:ObjectID(userId),
                  products:[ObjectID(proId)]
              }
              db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                  resolve()
              })
          }
        })

    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:ObjectID(userId)}
                },{
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{proList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                      $in:['$_id','$$proList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
              resolve(cartItems[0].cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectID(userId)})
            if(cart){
                count=cart.products.length
            }
            resolve(count)
        })
    }
}