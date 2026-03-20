import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@ecom.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin created:', admin.email);

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user'
    });
    console.log('User created:', user.email);

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor and garden supplies' },
    ]);
    console.log('Categories created');

    // Create sample products with slugs
    const products = [
      { name: 'Wireless Headphones', slug: 'wireless-headphones', description: 'High-quality wireless headphones with noise cancellation', price: 149.99, category: categories[0]._id, stock: 25, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], isActive: true, featured: true },
      { name: 'Smart Watch', slug: 'smart-watch', description: 'Feature-rich smartwatch with health tracking', price: 299.99, category: categories[0]._id, stock: 15, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'], isActive: true },
      { name: 'Laptop Stand', slug: 'laptop-stand', description: 'Ergonomic aluminum laptop stand', price: 49.99, category: categories[0]._id, stock: 8, images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'], isActive: true },
      { name: 'Cotton T-Shirt', slug: 'cotton-t-shirt', description: 'Comfortable 100% cotton t-shirt', price: 24.99, category: categories[1]._id, stock: 100, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], isActive: true, featured: true },
      { name: 'Denim Jeans', slug: 'denim-jeans', description: 'Classic fit denim jeans', price: 59.99, category: categories[1]._id, stock: 50, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'], isActive: true },
      { name: 'Smart LED Bulb', slug: 'smart-led-bulb', description: 'WiFi enabled smart LED bulb', price: 19.99, category: categories[2]._id, stock: 200, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'], isActive: true },
    ];
    await Product.insertMany(products);
    console.log('Products created');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@ecom.com / admin123');
    console.log('User:  john@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
