const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
 productName: {
    type: String,
    required: true,
    unique:true
 },
 categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
 },
 batchNumber:{
   type:String
 },
 productDescription: {
    type: String
 },
 productPrice: {
    type: Number,
    required: true
 },
 productActualPrice:{
    type:Number,
    require:true
 },
 productQuantity: {
    type: Number,
    required: true
 },
 productImage: {
    type: String,
    required: true
 },
 productMfgDate:{
    type:Date
 },
 productExpiyDate:{
    type:Date
 },
 productBarcode:{
    type: String
 },
 slug:String,
 active: {
    type: Boolean,
    default: 1
  },
  reviews: [
   {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Review',
   },
 ],
  createdAt: {
    type: Date,
    default: Date.now
},
updatedAt: {
    type: Date,
    default: Date.now
}
});

module.exports = Product = mongoose.model('Product', ProductSchema);