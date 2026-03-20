import * as reviewService from '../services/reviewService.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.params.productId, req.body);
    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct = async (req, res, next) => {
  try {
    const result = await reviewService.getReviewsByProduct(req.params.productId, req.query);
    res.json({
      success: true,
      data: result,
      message: 'Reviews retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getReviews(req.query);
    res.json({
      success: true,
      data: result,
      message: 'Reviews retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    res.json({
      success: true,
      data: review,
      message: 'Review retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.user.id, req.body);
    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.json({
      success: true,
      data: {},
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const review = await reviewService.approveReview(req.params.id);
    res.json({
      success: true,
      data: review,
      message: 'Review approved successfully'
    });
  } catch (error) {
    next(error);
  }
};
