const db = require("../../models/product");
const review=require('../../models/review');
const Category=require('../../models/category');
const constants = require("../../constants/constants");
const logger = require('../../lib/logger'); 
const { options } = require("superagent");

createProduct = async function (opts) {
  try {
    console.log(opts)
    const product = await db.create(opts);
    return product;
  } catch (err) {
    logger.info(`Error in creating product db query: ${err.message}`);
    throw new Error(`Error in creating product`);
  }
};

findProduct = async function (opts) {
  const product = await db.findById( opts );
  return product;
};

getProductByName = async function (name) {
  const product = (await db.findOne({ productName: name  }).exec());
  return product;
};

updateProduct = async function (id, product) {
  await db.findByIdAndUpdate(id,product);
  const updatedproduct = (await db.findById(id));
  return updatedproduct ;
};
deleteProduct = async function (id) {
  let deleted=await db.findByIdAndDelete(id);
  return deleted;
}
getAllproducts = async function () {
  return db.find({}
    //{
    // limit: opts.limit,
    // offset: opts.limit * (opts.page - constants.Numbers.one),
    // order: [["createdAt", "DESC"]]
   //}
  );
};

// getArrayproducts = async function (opts) {
//   try {
//    return db.findAll({
//       where: { productId: { [Sequelize.Op.in]: opts } },
//       attributes: ['email','productId'],
//       raw: true
//     });
//   } catch (err) {
//     logger.info(`Error in finding product email db query: ${err.message}`);
//     throw new Error(`Error in finding a product using array of product id: ${err}`);
//   }
// };
updateStock = async function (id, quantity) {
  let product=await db.findById(id);
  
 const updatedproduct = await db.findByIdAndUpdate(id,{$set:{productQuantity:parseInt(product.productQuantity)-quantity}});
 return updatedproduct;

};

//review code
createReview = async function (opts) {
  try {
    const review = await review.create(opts);
    return review;
  } catch (err) {
    logger.info(`Error in creating review db query: ${err.message}`);
    throw new Error(`Error in creating review`);
  }
};

updateReview = async function (id, product) {
  await review.findByIdAndUpdate(id,product);
  const updatedproduct = (await db.findById(id));
  return updatedproduct ;
};

deleteReview = async function (id) {
  let deleted=await db.findByIdAndDelete(id);
  return deleted;
}

addCategoryToProduct=async function(opts){
  try {
    const category = await Category.create(opts);
    return category;
  } catch (err) {
    logger.info(`Error in creating category db query: ${err.message}`);
    throw new Error(`Error in creating category`);
  }
}
module.exports = {
  createProduct,
  findProduct,
  getProductByName,
  updateProduct,
  addCategoryToProduct,
  getAllproducts,
  updateStock
//   getArrayproducts
};
