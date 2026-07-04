
import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";



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

 
}
