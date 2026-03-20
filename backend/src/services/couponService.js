import Coupon from '../models/Coupon.js';

export const createCoupon = async (data) => {
  const coupon = await Coupon.create(data);
  return coupon;
};

export const getCoupons = async (query = {}) => {
  const { search, isActive } = query;
  
  const filter = {};
  
  if (search) {
    filter.code = { $regex: search, $options: 'i' };
  }
  
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const coupons = await Coupon.find(filter).sort({ createdAt: -1 });
  return coupons;
};

export const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  return coupon;
};

export const getCouponByCode = async (code) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  return coupon;
};

export const validateCoupon = async (code, subtotal = 0) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  
  if (!coupon.isValid()) {
    if (!coupon.isActive) throw new Error('Coupon is not active');
    if (coupon.expiresAt < new Date()) throw new Error('Coupon has expired');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }
  }
  
  const discount = coupon.calculateDiscount(subtotal);
  
  return {
    coupon,
    discount,
    finalSubtotal: subtotal - discount
  };
};

export const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  return coupon;
};

export const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  return coupon;
};

export const incrementCouponUsage = async (id) => {
  const coupon = await Coupon.findByIdAndUpdate(
    id,
    { $inc: { usedCount: 1 } },
    { new: true }
  );
  return coupon;
};
