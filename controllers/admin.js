const logger = require("../lib/logger");
const resp = require("../lib/response");
const kart = require("../lib/queries/kart");
const orderQuery = require("../lib/queries/order")
const productQuery=require( "../lib/queries/product" )
const utils = require("../lib/utils");
const constants = require("../constants/constants");
const _ = require("lodash");
const config = require("config");

const report =async function(req,res,next){
  try{
    let {fromDate,toDate}=req.query;
    fromDate=new Date(fromDate);
    if(!toDate){
      toDate = new Date();
      toDate.setDate(toDate.getDate() + 1);
    }else{
    toDate=new Date(toDate);
    }
   console.log(toDate)
    let data=await orderQuery.getAllOrderDateWise(fromDate,toDate)

  return resp.sendResponse(constants.response_code.SUCCESS, `report ceated `,data, res);
  }
  catch(err){
    logger.info(`Error in fetch report: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
}
let a=()=>{
  
}

module.exports = {
    report
};