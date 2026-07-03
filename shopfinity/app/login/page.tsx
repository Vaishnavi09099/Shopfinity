'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock,Package, Eye, EyeOff, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
   const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
   
    const [loading,setLoading] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const router = useRouter();
  


  const handleSignIn = async(e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await signIn("credentials",{
        email,password,

        redirect:false
      })
      alert("SignIned successfully")
      
      router.push("/")

    }catch(err){
      console.log(err)

    }finally{
      setLoading(false)
    }
  }
  const features = [
    {
      icon: <Package className="w-5 h-5 text-white" />,
      title: 'Wide Product Selection',
      desc: 'Explore products from multiple categories.',
    },
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      title: 'Fast Checkout',
      desc: 'Secure payments in just a few clicks.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      title: 'Trusted Marketplace',
      desc: 'Verified sellers and protected purchases.',
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-orange-700 via-pink-600 to-purple-700 p-12 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
    <img className='w-6 h-5' src='./favicon.ico'></img>
          <span>Shopfinity</span>
        </div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl w-fit"
        >
              <img className='w-20 h-20' src='./favicon.ico'></img>
        </motion.div>

        <div>
          <h1 className="text-white text-4xl font-extrabold leading-tight mb-4">
            Welcome back to <br /> 
Your shopping destination.
          </h1>
          <p className="text-white/80 mb-8 max-w-md">
            Find your favorite products, track your orders, and enjoy a seamless shopping experience.
          </p>

          <div className="space-y-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-semibold">{f.title}</p>
                  <p className="text-white/70 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/60 text-xs">© 2026 Shopfinity. Everything You Need, All in One Place.</p>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-extrabold mb-2">
            Sign in to{' '}
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Shopfinity
            </span>
          </h2>
          <p className="text-gray-500 mb-8 text-sm">Enter your details to continue where you left off.</p>


  <form onSubmit={handleSignIn}>
      <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 tracking-wide">EMAIL</label>
              <div className="flex items-center gap-2 border border-gray-400/50 rounded-3xl px-4 py-3 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full outline-none bg-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 tracking-wide">PASSWORD</label>
                <span className="text-xs text-pink-600 font-medium cursor-pointer">Forgot?</span>
              </div>
              <div className="flex items-center gap-2 border-gray-400/50 rounded-3xl  border px-4 py-3 mt-1">
                <Lock className="w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className="w-full outline-none bg-transparent text-sm"
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={() => setKeepSignedIn(!keepSignedIn)}
                className="w-4 h-4 accent-pink-600"
              />
              Keep me signed in
            </label>
          </div>

           <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold text-sm py-3 rounded-3xl"
          >
           {loading ?"Signing In...." :"Sign In"} <ArrowRight className="w-4 h-4" />
          </motion.button>



  </form>
        

         
          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 border  border-gray-400/40 shadow-xl rounded-3xl py-3 text-sm font-medium">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
            Continue with Google
          </button>

          <p className="text-center mt-6 text-gray-500 text-sm">
            New to Shopfinity?{' '}
            <span onClick={()=>router.push("/register")} className="text-pink-600 font-medium cursor-pointer">Create an account →</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default SignIn