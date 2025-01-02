const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.json(products);
}));

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    descriptionImage: req.body.descriptionImage,
    originalPrice: req.body.originalPrice,
    discountedPrice: req.body.discountedPrice,
    offers: req.body.offers
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
}));

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const {
    name,
    image,
    descriptionImage,
    originalPrice,
    discountedPrice,
    offers,
    isActive
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.image = image || product.image;
    product.descriptionImage = descriptionImage || product.descriptionImage;
    product.originalPrice = originalPrice || product.originalPrice;
    product.discountedPrice = discountedPrice || product.discountedPrice;
    product.offers = offers || product.offers;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isActive = false;
    await product.save();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

module.exports = router;
