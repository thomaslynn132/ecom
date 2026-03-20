import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'EcomStore'
  },
  storeEmail: {
    type: String,
    default: 'support@ecomstore.com'
  },
  storePhone: String,
  storeAddress: String,
  currency: {
    code: {
      type: String,
      default: 'USD'
    },
    symbol: {
      type: String,
      default: '$'
    },
    position: {
      type: String,
      enum: ['before', 'after'],
      default: 'before'
    }
  },
  tax: {
    enabled: {
      type: Boolean,
      default: false
    },
    rate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative'],
      max: [100, 'Tax rate cannot exceed 100%']
    }
  },
  shipping: {
    freeShippingThreshold: {
      type: Number,
      default: 50
    },
    defaultFee: {
      type: Number,
      default: 5
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
