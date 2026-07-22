import mongoose, { Schema, Document, Types } from "mongoose";
import { IProduct } from "./product.model";
import { IUser } from "./user.model";

export interface IOrder {
  products: {
    product: IProduct;
    quantity: number;
    price: number;
  }[];

  buyer: IUser;
  productVendor: IUser;

  productsTotal: number;
  deliveryCharge: number;
  serviceCharge: number;
  totalAmount: number;

  paymentMethod: "cod" | "stripe";
  isPaid: boolean;

  orderStatus:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "return_requested"
    | "return_approved"
    | "return_rejected"
    | "returned"
    | "cancelled";

  cancelledAt?: Date;
  returnedAmount?: number;
  returnReason?: string | null;
rejectionReason?: string | null;
  refundedAt?: Date;

  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };

  paymentDetails?: {
    stripePaymentId?: string;
    stripeSessionId?: string;
  };
 deliveryDate?:Date;
  



  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productVendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productsTotal: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    serviceCharge: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "stripe"],
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "return_requested",
        "return_approved",
        "return_rejected",
        "returned",
        "cancelled",
      ],
      default: "pending",
    },
    cancelledAt: {
      type: Date,
    },

    returnedAmount: {
      type: Number,
      default: 0,
    },

    returnReason: {
      type: String,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    address: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },

    paymentDetails: {
      stripePaymentId: String,
      stripeSessionId: String,
    },

     deliveryDate: {
  type: Date,
},
   


  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
