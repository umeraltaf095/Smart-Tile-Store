import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  itemId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '',
  },
  unitType: {
    type: String,
    default: 'Sq.Ft',
  },
  boxCoverage: {
    type: Number,
    default: 15.0,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  pricePerBox: {
    type: Number,
    required: true,
  },
  boxes: {
    type: Number,
    required: true,
    min: [1, 'Must order at least 1 box'],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      default: '',
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    orderType: {
      type: String,
      enum: ['Direct Purchase', 'Price Quotation'],
      default: 'Direct Purchase',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'To be discussed with Quotation'],
      default: 'Cash on Delivery',
    },
    items: [OrderItemSchema],
    totalBoxes: {
      type: Number,
      required: true,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be positive'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

