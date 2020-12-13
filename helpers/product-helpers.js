var db=require('../config/connection')
var collection=require('../config/collections')
const { response } = require('express')
const { ObjectID } = require('mongodb')
var objctId=require('mongodb').ObjectID
module.exports=
{
    addproducts:(products,callback)=>{
    

       
        db.get().collection('products').insertOne(products).then((data)=>{
         
         callback(data.ops[0]._id)

        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:ObjectID(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductsDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(proId)},
            {
                $set:{
                    name:proDetails.name,
                    category:proDetails.category,
                    discription:proDetails.discription,
                    price:proDetails.price
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}