const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{admin:true,products})
  })

});

router.get('/add-products',function(req,res){
  res.render('admin/add-products')
})
router.post('/add-products',function(req,res){
  console.log(req.body);
  console.log(req.files.image);

  productHelpers.addproducts(req.body,(id)=>{
    let image1=req.files.image
    image1.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
      res.render('admin/add-products');}
      else if(req.files.image){
        let  Image=req.files.image
      }
      else{
        console.log(err)
      }
    })
    
  })
})
router.get('/delete-products/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})
 router.get('/edit-products/:id',async (req,res)=>{
   let product=await productHelpers.getProductsDetails(req.params.id)
   console.log(product)
   res.render('admin/edit-products',{product})

 })
 router.post('/edit-products/:id',(req,res)=>{
   let id=req.params.id
   productHelpers.updateProduct(req.params.id,req.body).then(()=>{
     res.redirect('/admin')
     if(req.files.image){
       let  Image=req.files.image
      Image.mv('./public/product-images/'+id+'.jpg')
     }
   })
 })
module.exports = router;
