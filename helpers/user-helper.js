var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { ObjectID } = require('mongodb')
var objctId = require('mongodb').ObjectID
module.exports = {
    doSignup: (UserData) => {
        return new Promise(async (resolve, reject) => {
            UserData.Password = await bcrypt.hash(UserData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(UserData).then((data) => {
                resolve(data.ops[0])
            })

        })


    },
    doLogin: (UserData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: UserData.Email })
            if (user) {
                bcrypt.compare(UserData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log('login success')
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed')
                        resolve({ status: false })
                    }

                })
            } else {
                console.log('not a user')
            }
        })
    },
    addToCart: (proId, userId) => {
        let proObj = {
            item: ObjectID(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: ObjectID(userId) })
            if (userCart) {
                let proExist = userCart.products.findIndex(product => product.item == proId)
                console.log(proExist)
                if (proExist != -1) {
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: objctId(userId), 'products.item': ObjectID(proId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }).then(() => {
                                resolve()
                            })
                } else {
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: ObjectID(userId) },
                            {
                                $push: { products: proObj }
                            }
                        ).then((response) => {
                            resolve()
                        })
                }
            } else {
                let cartObj = {
                    user: ObjectID(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })

    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: ObjectID(userId) }
                }, {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                }, {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    },
                }, {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()

            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: ObjectID(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeProductQuantity: (details) => {
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        return new Promise((resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: ObjectID(details.cart) },
                        {
                            $pull: { products: { item: ObjectID(details.product) } }
                        }
                    ).then((response) => {

                        resolve({ status:true })
                    })
            } else {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: ObjectID(details.cart), 'products.item': ObjectID(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }).then((response) => {
                            resolve(true)
                        })
            }
        })
    },
   
 getTotalAmount: (userId)=>{
    return new Promise(async (resolve, reject) => {
        let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match: { user: ObjectID(userId) }
            }, {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            }, {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                },
            },
             {
                $project: {
                    item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                }
            },{
                $group:{
                    _id:null,
                    
                    total:{$sum:{$multiply:['$quantity','$product.price']}}
                }
            }
        ]).toArray()
         console.log(total);
        resolve(total[0].total)
    })
 },
  removeProduct: (details) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.CART_COLLECTION)
            .updateOne({ _id: ObjectID(details.cart) },
                {
                    $pull: { products: { item: ObjectID(details.product) } }
                }
            ).then((response) => {

                resolve({ removeProduct: true })
            })
    })
},
}
