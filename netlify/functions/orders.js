const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('product-landing-cod');
    
    if (event.httpMethod === 'POST' && event.body) {
      const order = JSON.parse(event.body);
      order.createdAt = new Date();
      order.status = 'new';
      
      await db.collection('orders').insertOne(order);
      
      return {
        statusCode: 201,
        body: JSON.stringify(order),
      };
    }
    
    // Verify admin token for protected routes
    const token = event.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }
    
    if (event.httpMethod === 'GET') {
      const orders = await db.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return {
        statusCode: 200,
        body: JSON.stringify(orders),
      };
    }
    
    if (event.httpMethod === 'PUT') {
      const orderId = event.path.split('/').pop();
      const updates = JSON.parse(event.body);
      
      await db.collection('orders').updateOne(
        { _id: orderId },
        { $set: updates }
      );
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Order updated successfully' }),
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
