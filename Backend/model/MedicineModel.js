const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    productName: String,
    description: String,
    unitprice: Number,
    sellingprice:Number,
    category: String,
    image: String,
    quantity:Number,
    manufactureDate:Date,
    expiryDate:Date,
    companyName:String,
    supplierID:String,
    createdAt:{type:Date,default: Date.now},
  });
  
  // Create a model
  const ProductModel = mongoose.model('product', medicineSchema);

  module.exports = ProductModel;