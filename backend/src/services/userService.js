import User from '../models/User.js';

export const getAllUsers = async () => {
  const users = await User.find().select('-refreshToken');
  return users;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-refreshToken');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUser = async (userId, userData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    userData,
    { new: true, runValidators: true }
  ).select('-refreshToken');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getUserStats = async () => {
  const totalUsers = await User.countDocuments();
  const adminCount = await User.countDocuments({ role: 'admin' });
  const userCount = await User.countDocuments({ role: 'user' });
  return { totalUsers, adminCount, userCount };
};
