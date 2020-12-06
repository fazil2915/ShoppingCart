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
      else{
        console.log(err)
      }
    })
    
  })
})
 
module.exports = router;
