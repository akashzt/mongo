const express = require("express");
const router = express.Router();
const controller = require("../controllers/product");
const kartController=require("../controllers/kart");
const orderConroller=require("../controllers/order");
const userAuth = require("../middlewares/authorization");
const adminAuth=require("../middlewares/adminAuth");



// create a new product
router.post("/product", controller.createPoduct);
// update details for an existing product.
router.put("/product",userAuth,adminAuth, controller.updateProduct);
//delete product
router.delete("product",userAuth,adminAuth,controller.deleteProduct);

//get all product
router.get("/allproduct",controller.getAllProducts)


//create a new caregory

router.post("/category",userAuth,adminAuth,controller.addCategory);


//kart routes

router.post("/addtokart",userAuth,kartController.createKart);
router.get('/showkart',userAuth,kartController.getAllProductsInKart);
router.delete("/deletekart",userAuth,kartController.deleteProductInKart)


//order routes
router.get("/makeorder" ,userAuth,orderConroller.buyProduct)

//show order
router.get("/myorders" ,userAuth,orderConroller.showMyOrder)
//show paticular order
router.get("/myorders/:orderId" ,userAuth,orderConroller.orderDetails)

module.exports = router;

