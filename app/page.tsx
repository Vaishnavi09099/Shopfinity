
import { auth } from "@/auth";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/User/UserDashboard";
import EditVendorDetails from "@/components/Vendor/EditVendorDetails";

import VendorPage from "@/components/Vendor/VendorPage";



import connectDb from "@/lib/connectDb";


import User from "@/models/user.model";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic" 



export default async function Home() {
  await connectDb()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if(!user){
    redirect("/login")
  }
  const inComplete = !user.role || !user.phone || (!user.phone && user.role == "user")
  if(inComplete){
    return <EditRoleMobile/>
  }

  if(user.role == 'vendor'){
    const inCompleteDetails = !user.shopName || !user.shopAddress || !user.gstNumber
    if(inCompleteDetails){
      return <EditVendorDetails/>
    }
  }



  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <>
     
    <Navbar user = {plainUser}/>
      {user?.role =="shopper" ? <UserDashboard /> :user?.role== "vendor" ? <VendorPage user={plainUser}/> : <AdminDashboard />}
  
  <Footer user = {plainUser}/>
     
  
    </>
   
  
    
  );
}
