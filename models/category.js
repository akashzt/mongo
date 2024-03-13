const mongoose=require('mongoose');

const categorySchema=mongoose.Schema({
    catagoryName:{
        type: String,
        required:[true,"Please provide a name for the Category"]
    },
    description:{
        type: String
    },
    active: {
        type: Boolean,
        default: 1
      },
      createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model("Category",categorySchema);