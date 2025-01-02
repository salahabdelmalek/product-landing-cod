const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event, context) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('product-landing-cod');
    
    if (event.httpMethod === 'POST' && event.path.includes('/login')) {
      const { email, password } = JSON.parse(event.body);
      
      const user = await db.collection('users').findOne({ email });
      
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          JWT_SECRET,
          { expiresIn: '30d' }
        );
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
          }),
        };
      }
      
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }
    
    // Create initial admin user if none exists
    if (event.httpMethod === 'POST' && event.path.includes('/setup')) {
      const adminExists = await db.collection('users').findOne({ isAdmin: true });
      
      if (adminExists) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Admin user already exists' }),
        };
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
      };
      
      await db.collection('users').insertOne(adminUser);
      
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Admin user created successfully' }),
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
