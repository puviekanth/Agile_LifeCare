const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  email: String,
  cartItems: [
    {
      ProductName: String,
      ProductPrice: Number,
      ProductQuantity: Number,
      Subtotal: Number,
      Image: String,
    },
  ],
  deliveryMethod: { type: String, enum: ['home', 'instore'] },
  deliveryDetails: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
  },
  orderToken: String,
  createdAt: { type: Date, default: Date.now },
  Total:{type:Number,required:true},
  status:{type:String, enum: ['pending, processig, completed']}
});

const OrderModel = mongoose.model('order', OrderSchema);

module.exports = OrderModel;