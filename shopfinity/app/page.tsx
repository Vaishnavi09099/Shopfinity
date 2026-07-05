
import { auth } from "@/auth";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import EditRoleMobile from "@/components/EditRoleMobile";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/User/UserDashboard";
import VendorDashboard from "@/components/Vendor/VendorDashboard";



import connectDb from "@/lib/connectDb";


import User from "@/models/user.model";
import { redirect } from "next/navigation";



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



  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <>
     
    <Navbar user = {plainUser}/>
      {user?.role =="user" ? <UserDashboard /> :user?.role== "vendor" ? <VendorDashboard /> : <AdminDashboard />}
  
     
  
    </>
   
  
    
  );
}
