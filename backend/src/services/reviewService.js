import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const createReview = async (userId, productId, data) => {
  const existingReview = await Review.findOne({ user: userId, product: productId });
  if (existingReview) {
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating: data.rating,
    comment: data.comment
  });

  await updateProductRatings(productId);

  return review.populate('user', 'name avatar');
};

export const getReviewsByProduct = async (productId, query = {}) => {
  const { page = 1, limit = 10, rating } = query;
  
  const filter = { product: productId, isApproved: true };
  if (rating) {
    filter.rating = parseInt(rating);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const reviews = await Review.find(filter)
    .populate('user', 'name avatar')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments(filter);

  return {
    reviews,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  };
};

export const getReviews = async (query = {}) => {
  const { page = 1, limit = 10, search, product, user, rating, isApproved } = query;
  
  const filter = {};
  
  if (search) {
    filter.comment = { $regex: search, $options: 'i' };
  }
  
  if (product) {
    filter.product = product;
  }
  
  if (user) {
    filter.user = user;
  }
  
  if (rating) {
    filter.rating = parseInt(rating);
  }
  
  if (isApproved !== undefined) {
    filter.isApproved = isApproved === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const reviews = await Review.find(filter)
    .populate('user', 'name avatar email')
    .populate('product', 'name images')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments(filter);

  return {
    reviews,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  };
};

export const getReviewById = async (id) => {
  const review = await Review.findById(id)
    .populate('user', 'name avatar email')
    .populate('product', 'name images');
  if (!review) {
    throw new Error('Review not found');
  }
  return review;
};

export const updateReview = async (id, userId, data) => {
  const review = await Review.findOne({ _id: id, user: userId });
  if (!review) {
    throw new Error('Review not found or unauthorized');
  }

  review.rating = data.rating || review.rating;
  review.comment = data.comment || review.comment;
  await review.save();

  await updateProductRatings(review.product);

  return review.populate('user', 'name avatar');
};

export const deleteReview = async (id) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new Error('Review not found');
  }

  await Review.findByIdAndDelete(id);
  await updateProductRatings(review.product);

  return review;
};

export const approveReview = async (id) => {
  const review = await Review.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  );
  if (!review) {
    throw new Error('Review not found');
  }
  return review;
};

const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  
  const stats = reviews.reduce((acc, review) => {
    acc.sum += review.rating;
    acc.count += 1;
    return acc;
  }, { sum: 0, count: 0 });

  const ratings = stats.count > 0 ? stats.sum / stats.count : 0;

  await Product.findByIdAndUpdate(productId, {
    ratings: Math.round(ratings * 10) / 10,
    numReviews: stats.count
  });
};
