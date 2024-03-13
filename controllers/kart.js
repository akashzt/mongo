const logger = require("../lib/logger");
const resp = require("../lib/response");
const query = require("../lib/queries/kart");
const utils = require("../lib/utils");
const constants = require("../constants/constants");
const _ = require("lodash");
const config = require("config");

const createKart = async function (req, res, next) {
  try {
    logger.info("In create kart controller");
    const body = req.body;
    let {user}=req;
    // if any user is not any kart item
    if (body.product && !!(await query.getUserAvailableInKart(user.id))) {
      let {user}=req; 
      let data=await query.getAllKartProducts(user.id);
      //if product is in kart then we increase number else new created
      let flag=0;
      for (let pro of data.products) {
        // Compare product's product ID with its _id
        if (pro.product._id == body.product) {
          // If they match, increase quantity by 6
          console.log(pro.quantity)
          pro.quantity += body.quantity;
          flag=1;
          break;
        }
      }
      if(flag==0){
        data.products.push(body)
      }
     
      let ProductList = await query.updateKartProduct(data._id, data.products);
      return await resp.sendResponse(constants.response_code.SUCCESS, "Product update in kart",ProductList, res);
    }
    
    let kart = await query.createKartFirstProduct(body,user);
    logger.info(`Query: responded with new kart product`);
   return resp.sendResponse(constants.response_code.SUCCESS, "product Sucessfully Added to kart",kart, res);
  } catch (err) {
    logger.info(`Error in adding product in kart: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
};

const  getAllProductsInKart = async function (req, res, next) {
  try{
    logger.info('Getting all products in kart');  
    let {user}=req; 
    let products=await query.getAllKartProducts(user.id);
    return resp.sendResponse(constants.response_code.SUCCESS, "All product List in kart",products, res);
  }catch(err){
    logger.info(`Error in viewing product kart: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
}

// const updateProduct = async function (req, res, next) {

//   const body = _.pick(req.body, productFields);
//   try {
//     // console.log("Updatable:", body);
   
//     let productUpdated = await query.updateProduct(body.id, body);
//     productUpdatedValue = _.pick(productUpdated, productFields);

//     return resp.sendResponse(constants.response_code.SUCCESS, "product Updated", productUpdatedValue, res);
//   } catch (err) {
//     logger.info(`Error in updating user: ${err.message}`);
//     return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, err.message, null, res, err);
//   }
// };

const deleteProductInKart = async function (req, res, next) {
try { 
  let {id}=req.query;
  let productDeleted = await query.deleteKartProduct(id);

  return resp.sendResponse(constants.response_code.SUCCESS, "product in kart deleted succesfully", productDeleted, res);
} catch (err) {
  logger.info(`Error in updating user: ${err.message}`);
  return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, err.message, null, res, err);
}
};


module.exports = {
  createKart,
  getAllProductsInKart,
  deleteProductInKart
};