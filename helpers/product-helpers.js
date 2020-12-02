var db=require('../config/connection')
module.exports=
{
    addproducts:(products,callback)=>{
        console.log(products)

       
        db.get().collection('products').insertOne(products).then((data)=>{
         console.log(data)
         callback(data.ops[0]._id)

        })
    }
}