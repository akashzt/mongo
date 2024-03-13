const db = require("../../models/order");
const constants = require("../../constants/constants");
const product = require("../../models/product");
const logger = require("../../lib/logger");
const { options } = require("superagent");

const createOrder = async function (opts, total, id) {
  try {
    const order = new db({
      products: opts,
      user: id,
      totalAmount: total,
    });
    console.log(order);
    order.save();
    return order;
  } catch (err) {
    logger.info(`Error in creating order db query: ${err.message}`);
    throw new Error(`Error in creating order product`);
  }
};
const getMyAllOrder = async function (user) {
  let order = await db.find({ user: user }).sort({ createdAt: -1 });
  return order;
};

const getOrderDtails = async function (orderId) {
  let order = await db.findById(orderId).populate("products.product");
  return order;
};

const getAllOrderDateWise = async function (fromDate, toDate) {
  //   let order=await db.find({
  //     createdAt: {
  //     $gte: fromDate,
  //     $lte: toDate
  // }
 // });
  //.populate('products.product');
  let order = await db.aggregate([
    {
      $match: {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      },
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products", // The name of the collection
        localField: "products.product",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $group:{
        _id:'$products.product',
        totalQuantity:{$sum:'$products.quantity'},
        productDetails: { $first: "$productDetail" },
      }
    }
  ]);
  return order;
};
module.exports = {
  createOrder,
  getMyAllOrder,
  getOrderDtails,
  getAllOrderDateWise,
};
