import { create } from 'zustand';
import { productService } from '../services/api';

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  categories: [],
  totalPages: 1,
  currentPage: 1,
  total: 0,
  isLoading: false,
  error: null,
  filters: {
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  },

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const queryParams = { ...filters, ...params };
      const { data } = await productService.getProducts(queryParams);
      set({
        products: data.data.products,
        totalPages: data.data.totalPages,
        currentPage: data.data.currentPage,
        total: data.data.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await productService.getProductById(id);
      set({ currentProduct: data.data, isLoading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch product',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await productService.getCategories();
      set({ categories: data.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await productService.createProduct(productData);
      set((state) => ({
        products: [data.data, ...state.products],
        isLoading: false,
      }));
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create product',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await productService.updateProduct(id, productData);
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? data.data : p)),
        currentProduct: data.data,
        isLoading: false,
      }));
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update product',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete product',
        isLoading: false,
      });
      throw error;
    }
  },

  addReview: async (productId, reviewData) => {
    try {
      const { data } = await productService.addReview(productId, reviewData);
      set({ currentProduct: data.data });
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearFilters: () => {
    set({
      filters: {
        keyword: '',
        category: '',
        minPrice: '',
        maxPrice: '',
      },
    });
  },

  clearError: () => set({ error: null }),
}));
