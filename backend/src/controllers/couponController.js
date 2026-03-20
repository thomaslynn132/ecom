import * as couponService from '../services/couponService.js';

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getCoupons(req.query);
    res.json({
      success: true,
      data: coupons,
      message: 'Coupons retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (req, res, next) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    res.json({
      success: true,
      data: coupon,
      message: 'Coupon retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const result = await couponService.validateCoupon(code, subtotal);
    res.json({
      success: true,
      data: {
        code: result.coupon.code,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue,
        discount,
        finalSubtotal: result.finalSubtotal
      },
      message: 'Coupon validated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({
      success: true,
      data: {},
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
