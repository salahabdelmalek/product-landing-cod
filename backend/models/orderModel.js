const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  selectedOffer: {
    name: String,
    price: Number
  },
  status: {
    type: String,
    required: true,
    enum: ['new', 'confirmed', 'pending', 'cancelled', 'rejected', 'delivered', 'in-delivery'],
    default: 'new'
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
