
import { IProduct } from "@/models/product.model";
import { IUser } from "@/models/user.model";
import { createSlice } from "@reduxjs/toolkit";





interface IuserSlice{
    allVendorData: IUser[],
    allProductData: IProduct[],
  
}

const initialState:IuserSlice = {
    allVendorData:[],
    allProductData:[],
 
}
const vendorSlice = createSlice({
    name:"vendor",
    initialState,
    reducers:{
    setAllVendorData:(state,action)=>{
        state.allVendorData = action.payload
    },
    setAllProductsData:(state,action)=>{
        state.allProductData = action.payload
    },
  

    }

    
})

export const {setAllVendorData} = vendorSlice.actions
export const {setAllProductsData} = vendorSlice.actions
export default vendorSlice.reducer