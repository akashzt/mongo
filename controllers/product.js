const logger = require("../lib/logger");
const resp = require("../lib/response");
const query = require("../lib/queries/product");
const utils = require("../lib/utils");
const constants = require("../constants/constants");
const _ = require("lodash");
const config = require("config");


// Fields to be used in queries or responses
const productFields = [
    "_id",
    "productName",
    "categoryId",
    "productDescription",
    "productPrice",
    "productActualPrice",
    "productQuantity",
    "productMfgDate",
    "productExpiryDate",
    "productImage",
    "productBarcode",
    "active"
  ];

const createPoduct = async function (req, res, next) {
  try {
    logger.info("In create product controller");
    const body = req.body;
    // do not allow duplicate product in db
    if (body.productName && !!(await query.getProductByName(body.productName))) {
      return await resp.sendResponse(constants.response_code.DUPLICATE, "Product already exist!", null, res);
    }
    
    let product = await query.createProduct(body);
    logger.info(`Query: responded with new product created: ${product}`);
    res.body = _.pick(product, productFields);
   return resp.sendResponse(constants.response_code.SUCCESS, "Success create product",_.pick(product, productFields), res);
  } catch (err) {
    logger.info(`Error in creating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
};

const  getAllProducts = async function (req, res, next) {
  try{
    logger.info('Getting all products');  
    let products=await query.getAllproducts();
    return resp.sendResponse(constants.response_code.SUCCESS, "All product List",products, res);
  }catch(err){
    logger.info(`Error in viewing product: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
}

const updateProduct = async function (req, res, next) {

  const body = _.pick(req.body, productFields);
  try {
    // console.log("Updatable:", body);
   
    let productUpdated = await query.updateProduct(body.id, body);
    productUpdatedValue = _.pick(productUpdated, productFields);

    return resp.sendResponse(constants.response_code.SUCCESS, "product Updated", productUpdatedValue, res);
  } catch (err) {
    logger.info(`Error in updating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, err.message, null, res, err);
  }
};

const deleteProduct = async function (req, res, next) {
try { 
  let {id}=req.params;
  let productDeleted = await query.deleteProduct(id);

  return resp.sendResponse(constants.response_code.SUCCESS, "product deleted succesfully", productDeleted, res);
} catch (err) {
  logger.info(`Error in updating user: ${err.message}`);
  return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, err.message, null, res, err);
}
};
const addReview =async function(req,res,next){
  try {
    logger.info("In create review for product");
    const body = req.body;
    
    let product = await query.createProduct(body);
    logger.info(`Query: responded with new user created: ${product}`);
    res.body = _.pick(product, productFields);
   return resp.sendResponse(constants.response_code.SUCCESS, "Success",_.pick(product, productFields), res);
  } catch (err) {
    logger.info(`Error in creating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
}

const addCategory=async function(req,res,next){
  try {
    logger.info("in category create for product");
    let category=await  query.addCategoryToProduct(req.body);
    logger.info(`Query: responded with new categoy created: ${category}`);
   return resp.sendResponse(constants.response_code.SUCCESS, "Success category created",category, res);
  } catch (err) {
    logger.info(`Error in creating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
}


module.exports = {
  createPoduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  addCategory
};