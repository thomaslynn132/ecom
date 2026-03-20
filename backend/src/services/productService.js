import Product from '../models/Product.js';
import Settings from '../models/Settings.js';

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const getProducts = async (query = {}) => {
  const { keyword, category, minPrice, maxPrice, page = 1, limit = 10, sort = '-createdAt' } = query;
  
  const searchQuery = {};
  
  if (keyword) {
    searchQuery.$text = { $search: keyword };
    searchQuery.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ];
  } else {
    searchQuery.$or = [
      { name: { $regex: keyword || '', $options: 'i' } },
      { description: { $regex: keyword || '', $options: 'i' } }
    ];
  }
  
  if (category) {
    searchQuery.category = category;
  }
  
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
    if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const products = await Product.find(searchQuery)
    .populate('category', 'name slug')
    .skip(skip)
    .limit(parseInt(limit))
    .sort(sort);

  const total = await Product.countDocuments(searchQuery);

  return {
    products,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total,
    hasMore: parseInt(page) * parseInt(limit) < total
  };
};

export const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate('category', 'name slug');
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const updateProduct = async (productId, productData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    productData,
    { new: true, runValidators: true }
  ).populate('category', 'name slug');
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const getCategories = async () => {
  const categories = await Product.distinct('category');
  return categories;
};

export const getLowStockProducts = async () => {
  const settings = await Settings.findOne();
  const threshold = settings?.lowStockThreshold || 10;
  
  const products = await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    stock: { $gt: 0 }
  }).populate('category', 'name');

  return products;
};

export const getProductStats = async () => {
  const totalProducts = await Product.countDocuments();
  const outOfStock = await Product.countDocuments({ stock: 0 });
  const lowStock = await Product.countDocuments({
    $expr: { $and: [{ $lte: ['$stock', '$lowStockThreshold'] }, { $gt: ['$stock', 0] }] }
  });
  const featured = await Product.countDocuments({ featured: true });
  const active = await Product.countDocuments({ isActive: true });

  return { totalProducts, outOfStock, lowStock, featured, active };
};
