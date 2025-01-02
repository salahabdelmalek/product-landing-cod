const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('product-landing-cod');
    
    if (event.httpMethod === 'GET') {
      const products = await db.collection('products').find({ isActive: true }).toArray();
      
      return {
        statusCode: 200,
        body: JSON.stringify(products),
      };
    }
    
    if (event.httpMethod === 'POST' && event.body) {
      const product = JSON.parse(event.body);
      await db.collection('products').insertOne(product);
      
      return {
        statusCode: 201,
        body: JSON.stringify(product),
      };
    }
    
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
