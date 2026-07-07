
import { IUser } from "@/models/user.model";
import { createSlice } from "@reduxjs/toolkit";





interface IuserSlice{
    allVendorData: IUser[],
  
}

const initialState:IuserSlice = {
    allVendorData:[],
 
}
const vendorSlice = createSlice({
    name:"vendor",
    initialState,
    reducers:{
    setAllVendorData:(state,action)=>{
        state.allVendorData = action.payload
    },
  

    }

    
})

export const {setAllVendorData} = vendorSlice.actions
export default vendorSlice.reducer