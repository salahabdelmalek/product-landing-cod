const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const {
    product,
    customerName,
    phoneNumber,
    address,
    selectedOffer,
    totalAmount
  } = req.body;

  const order = new Order({
    product,
    customerName,
    phoneNumber,
    address,
    selectedOffer,
    totalAmount,
    status: 'new'
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
}));

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('product', 'name image');
  res.json(orders);
}));

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
router.get('/:id', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

// @desc    Get orders statistics
// @route   GET /api/orders/stats/count
// @access  Private/Admin
router.get('/stats/count', protect, admin, asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const formattedStats = stats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  res.json(formattedStats);
}));

module.exports = router;
