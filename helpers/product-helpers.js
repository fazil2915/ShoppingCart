var db=require('../config/connection')
var collection=require('../config/collections')
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
    }
}