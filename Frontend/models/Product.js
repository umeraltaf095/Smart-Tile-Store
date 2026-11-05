import mongoose from 'mongoose';
import Category from './Category'; // Ensure Category model is registered for populate

const ProductSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: [true, 'Item ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    size: {
      type: String,
      default: '',
      trim: true,
    },
    design: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    unitType: {
      type: String,
      required: [true, 'Unit type is required'],
      default: 'Sq.Ft',
      trim: true,
    },
    boxCoverage: {
      type: Number,
      default: 15.0,
      min: [0, 'Box coverage must be positive'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: [true, 'Status is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

