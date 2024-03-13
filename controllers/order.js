const logger = require("../lib/logger");
const resp = require("../lib/response");
const kart = require("../lib/queries/kart");
const orderQuery = require("../lib/queries/order")
const productQuery=require( "../lib/queries/product" )
const utils = require("../lib/utils");
const constants = require("../constants/constants");
const _ = require("lodash");
const config = require("config");


const  getAllProductsInKart = async function (req, res, next) {
  try{
    logger.info('Getting all products in kart'); 
    let {user}=req; 
    let products=await kart.getAllKartProducts(user.id);
    return resp.sendResponse(constants.response_code.SUCCESS, "All product List in kart",products, res);
  }catch(err){
    logger.info(`Error in viewing product kart: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
}


const buyProduct =async function(req,res,next){
  try{
    let {user}=req; 
    let data=await kart.getAllKartProducts(user.id);
    if(!data){
        return resp.sendResponse(constants.response_code.NOT_FOUND, "Not any product in kart",{}, res);
    }
    let order=[]
    let total=0;
    for(let i=0;i<data.products.length;i++){
        //console.log(data.products[i].product.productPrice,data.products[i].quantity)
        if(data.products[i].product.productQuantity>data.products[i].quantity){
         total+=parseInt(data.products[i].product.productPrice)*parseInt(data.products[i].quantity);
        }
        else{
          throw new Error(`out of stock: ${data.products[i].product.productName}`);
        }
        order.push({
        "product":data.products[i].product._id,
        "quantity":data.products[i].quantity
        })
        
    }

    
    let createOrder= await orderQuery.createOrder(order,total, user.id);
    if(createOrder){
      await kart.deleteKart(data._id);
      //reduce product stock
      for (let reducePoduct of order) {
        await productQuery.updateStock(reducePoduct.product,reducePoduct.quantity);
      }
    }

    return resp.sendResponse(constants.response_code.SUCCESS, `order created `,createOrder, res);
  }
  catch(err){
    logger.info(`Error in make a order: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
}

const showMyOrder= async function(req,res,next){
  let {user}=req;
  try{
    let myOrder=await orderQuery.getMyAllOrder(user.id);
    return resp.sendResponse(constants.response_code.SUCCESS, "my succesful order list",myOrder, res);

  }
  catch(err){
    logger.info(`Error in show a order: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }

}

const orderDetails= async function(req,res,next){
  let orderId= req.params.orderId;
  try{
    let myOrder=await orderQuery.getOrderDtails(orderId);
    return resp.sendResponse(constants.response_code.SUCCESS, "my order items",myOrder, res);

  }
  catch(err){
    logger.info(`Error in show a particular order: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }

}


module.exports = {
  buyProduct,
  showMyOrder,
  orderDetails
};