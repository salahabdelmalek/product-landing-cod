const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
  // Get orders statistics
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  // Get total products count
  const totalProducts = await Product.countDocuments({ isActive: true });

  // Get recent orders
  const recentOrders = await Order.find({})
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  // Format order statistics
  const orderStatusCount = orderStats.reduce((acc, curr) => {
    acc[curr._id] = {
      count: curr.count,
      totalAmount: curr.totalAmount
    };
    return acc;
  }, {});

  // Calculate totals
  const totalOrders = orderStats.reduce((acc, curr) => acc + curr.count, 0);
  const totalRevenue = orderStats.reduce((acc, curr) => acc + curr.totalAmount, 0);

  res.json({
    orderStatusCount,
    totalOrders,
    totalRevenue,
    totalProducts,
    recentOrders
  });
}));

// @desc    Get sales analytics
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
router.get('/analytics', protect, admin, asyncHandler(async (req, res) => {
  // Get daily orders for the last 30 days
  const dailyOrders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Get top selling products
  const topProducts = await Order.aggregate([
    {
      $group: {
        _id: '$product',
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { totalOrders: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $unwind: '$product'
    }
  ]);

  res.json({
    dailyOrders,
    topProducts
  });
}));

module.exports = router;
