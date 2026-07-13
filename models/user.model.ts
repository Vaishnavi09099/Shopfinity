import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "shopper" | "admin" | "vendor";
  image?:string;
  phone?:string;

  // Vendor
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  isApproved: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  requestedAt?: Date;
  approvedAt?: Date;
  rejectedReason?: string;
     chats?: {
        with: mongoose.Types.ObjectId; // kis user ke saath chat
        messages: {
          sender: mongoose.Types.ObjectId; // kisne message bheja
          text: string;
          createdAt: Date;
        }[];
      }[];

  vendorProducts?: mongoose.Types.ObjectId[];
  orders?: mongoose.Types.ObjectId[];

  // User Cart
  cart?: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["shopper", "admin", "vendor"],
      default: "shopper",
    },

    // Vendor Details
    shopName: {
      type: String,
      trim: true,
    },

    shopAddress: {
      type: String,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
    
          chats: [
          {
            with: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
    
            messages: [
              {
                sender: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
                },
    
                text: {
                  type: String,
                  required: true,
                },
    
                createdAt: {
                  type: Date,
                  default: Date.now,
                },
              },
            ],
          },
        ],

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
    },

    rejectedReason: {
      type: String,
    },

    vendorProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
  
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;