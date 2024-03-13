const db = require("../../models/kart");
const constants = require("../../constants/constants");
const logger = require('../../lib/logger'); 
const { options } = require("superagent");

createKartFirstProduct = async function (opts,user) {
  try {
    const product = new db({
      products: [
        {
          product: opts.product,
          quantity: opts.quantity, // Set the desired quantity
        },
        // You can add more products if needed
      ],
      user: user.id,
    })
    product.save();
    return product;
  } catch (err) {
    logger.info(`Error in creating kart product db query: ${err.message}`);
    throw new Error(`Error in creating kart product`);
  }
};
getUserAvailableInKart = async function(id){
return await db.findOne({"user": id});
}
deleteKartProduct = async function (id) {
  let deleted=await db.findByIdAndDelete(id);
  return deleted;
}
deleteKart = async function (id) {
  let deleted=await db.findByIdAndDelete(id);
  return deleted;
}
updateKartProduct = async function (id, product) {
  await db.findByIdAndUpdate(id,{$set:{products:product}});
  const updatedproduct = (await db.findById(id));
  console.log(updatedproduct)
  return updatedproduct ;
};
getAllKartProducts = async function (id) {
  return db.findOne({user:id}
    //{
    // limit: opts.limit,
    // offset: opts.limit * (opts.page - constants.Numbers.one),
    // order: [["createdAt", "DESC"]]
   //}
  )
  .populate('products.product').exec() ; 
};
getAllKartProductsUnpopulte = async function (id) {
  return db.findOne({user:id}
    //{
    // limit: opts.limit,
    // offset: opts.limit * (opts.page - constants.Numbers.one),
    // order: [["createdAt", "DESC"]]
   //}
  )
 // .populate('products.product').exec() ; 
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


module.exports = {
  createKartFirstProduct,
  getUserAvailableInKart,
  updateKartProduct,
  deleteKartProduct,
  getAllKartProducts,
  getAllKartProductsUnpopulte,
  deleteKart
};
