import Category from '../models/Category.js';

export const createCategory = async (data) => {
  const category = await Category.create(data);
  return category;
};

export const getCategories = async (query = {}) => {
  const { parent, search, isActive } = query;
  
  const filter = {};
  
  if (parent) {
    filter.parent = parent === 'null' ? null : parent;
  }
  
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const categories = await Category.find(filter)
    .populate('parent', 'name')
    .sort({ order: 1, name: 1 });

  return categories;
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id).populate('parent', 'name');
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug }).populate('parent', 'name');
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const deleteCategory = async (id) => {
  const hasChildren = await Category.findOne({ parent: id });
  if (hasChildren) {
    throw new Error('Cannot delete category with children');
  }
  
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const getCategoryTree = async () => {
  const categories = await Category.find().sort({ order: 1, name: 1 });
  
  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => {
        if (parentId === null) return !cat.parent;
        return cat.parent?.toString() === parentId.toString();
      })
      .map(cat => ({
        ...cat.toObject(),
        children: buildTree(cat._id)
      }));
  };

  return buildTree();
};
