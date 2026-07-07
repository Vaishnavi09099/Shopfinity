import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "shopper" | "admin" | "vendor";
  image?: string;
  phone?: string;

  // Vendor fields
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  isApproved: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  requestedAt?: string;
  approvedAt?: string;
  rejectedReason?: string;

  vendorProducts?: string[];
  orders?: string[];

  cart?: {
    product: string;
    quantity: number;
  }[];

  createdAt?: string;
  updatedAt?: string;
}

interface IUserSlice {
  userData: IUser | null;
}

const initialState: IUserSlice = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUser>) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;