import Order from '../models/Order.js';
import * as couponService from './couponService.js';

export const createOrder = async (userId, orderData) => {
  const { items, shippingAddress, couponCode, paymentMethod } = orderData;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  let coupon = null;
  
  if (couponCode) {
    const couponResult = await couponService.validateCoupon(couponCode, subtotal);
    discount = couponResult.discount;
    coupon = {
      code: couponCode.toUpperCase(),
      id: couponResult.coupon._id
    };
  }

  const settings = await import('./settingsService.js').then(m => m.getSettings());

  let shippingFee = 0;
  if (settings.shipping.enabled) {
    const afterDiscount = subtotal - discount;
    if (afterDiscount < settings.shipping.freeShippingThreshold) {
      shippingFee = settings.shipping.defaultFee;
    }
  }

  let tax = 0;
  if (settings.tax.enabled) {
    tax = ((subtotal - discount) * settings.tax.rate) / 100;
  }

  const total = subtotal - discount + shippingFee + tax;

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    coupon,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    payment: {
      method: paymentMethod || 'cod',
      status: paymentMethod === 'cod' ? 'pending' : 'pending'
    }
  });

  if (coupon?.id) {
    await couponService.incrementCouponUsage(coupon.id);
  }

  return order;
};

export const getOrders = async (query = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    status, 
    userId,
    startDate,
    endDate
  } = query;
  
  const filter = {};
  
  if (userId) {
    filter.user = userId;
  }
  
  if (status) {
    filter.status = status;
  }
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(filter);

  return {
    orders,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  };
};

export const getOrderById = async (id, userId = null) => {
  const filter = { _id: id };
  if (userId) {
    filter.user = userId;
  }
  
  const order = await Order.findOne(filter)
    .populate('user', 'name email')
    .populate('items.product');
    
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('user', 'name email');
  
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

export const updatePaymentStatus = async (id, paymentData) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new Error('Order not found');
  }

  order.payment = {
    ...order.payment,
    ...paymentData
  };
  
  if (paymentData.status === 'paid') {
    order.payment.paidAt = new Date();
  }
  
  await order.save();
  return order.populate('user', 'name email');
};

export const getOrderStats = async () => {
  const totalOrders = await Order.countDocuments();
  
  const totalRevenue = await Order.aggregate([
    { $match: { 'payment.status': 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  const ordersLast7Days = await Order.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    ordersByStatus: Object.fromEntries(ordersByStatus.map(s => [s._id, s.count])),
    recentOrders,
    ordersLast7Days
  };
};

export const cancelOrder = async (id, userId) => {
  const order = await Order.findOne({ _id: id, user: userId });
  if (!order) {
    throw new Error('Order not found');
  }
  
  if (['delivered', 'cancelled'].includes(order.status)) {
    throw new Error('Cannot cancel this order');
  }
  
  order.status = 'cancelled';
  await order.save();
  return order;
};
