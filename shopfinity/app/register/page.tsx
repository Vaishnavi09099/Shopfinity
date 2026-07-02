'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Store, ShieldCheck, ArrowRight, ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

type Role = 'shopper' | 'vendor' | 'admin'

const roles: { id: Role; title: string; tag: string; desc: string; icon: React.ReactNode; gradient: string }[] = [
  {
    id: 'shopper',
    title: 'Shopper',
    tag: 'SHOP NOW',
    desc: 'Shop from a wide range of products.',
    icon: <ShoppingBag className="w-6 h-6 text-white" />,
    gradient: 'from-orange-500 to-pink-500',
  },
  {
    id: 'vendor',
    title: 'Vendor',
    tag: 'SELL WITH US',
    desc: 'Sell your products and grow your business.',
    icon: <Store className="w-6 h-6 text-white" />,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'admin',
    title: 'Admin',
    tag: 'ADMIN ACCESS',
    desc: 'Control and manage the entire marketplace.',
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    gradient: 'from-purple-600 to-fuchsia-600',
  },
]

const RegisterPage = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<Role>('shopper')
  const [showPassword, setShowPassword] = useState(false)
  const currentRole = roles.find((r) => r.id === selectedRole)!
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-200 via-pink-100 to-purple-200 flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-30  py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
         <img src='./favicon.ico' className='h-5 w-6'></img>
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Shopfinity
          </span>
        </div>
        <button className="text-gray-700 font-medium">Sign in</button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <div
          className={`w-9 h-9 rounded-full flex text-xs items-center justify-center text-white font-semibold bg-gradient-to-br from-pink-500 to-purple-600`}
        >
          1
        </div>
        <div className="w-16 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400" />
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold transition-colors ${
            step === 2 ? 'bg-gradient-to-br text-xs from-pink-500 to-purple-600 text-white' : 'bg-white text-gray-400 text-xs'
          }`}
        >
          2
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl text-center"
            >
              <h1 className="text-5xl font-extrabold mb-3">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  Shopfinity
                </span>
              </h1>
              <p className="text-gray-500 mb-10">Choose how you'd like to get started.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 ">
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedRole(role.id)}
                    className={`cursor-pointer text-left bg-white/70 backdrop-blur-md rounded-2xl p-6 border-2 transition-colors shadow-xl 
                         ${
                      selectedRole === role.id ? 'border-pink-500 ' : 'border-transparent'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4`}
                    >
                      {role.icon}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{role.title}</h3>
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full tracking-wide">
                        {role.tag}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{role.desc}</p>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === role.id ? 'border-pink-500' : 'border-gray-300'
                      }`}
                    >
                      {selectedRole === role.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-full"
              >
                Next <ArrowRight className="w-4 h-4" />
              </motion.button>

              <p className="mt-6 text-gray-500 text-sm">
                Already have an account?{' '}
                <span className="text-pink-600 font-medium cursor-pointer">Login →</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-8 shadow-2xl">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-gray-500 text-sm mb-6"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentRole.gradient} flex items-center justify-center`}
                  >
                    {currentRole.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 tracking-wide">SIGNING UP AS</p>
                    <p className="font-bold">{currentRole.title}</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-1">Create your account</h2>
                <p className="text-gray-500 text-sm mb-6">Start your shopping journey today.</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">FULL NAME</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full outline-none bg-transparent text-sm"
                        onChange={(e)=>setName(e.target.value)} value={name}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">EMAIL</label>
                    <div className="flex items-center gap-2 border border-gray-200  rounded-xl px-4 py-3 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full outline-none bg-transparent text-sm"
                          onChange={(e)=>setEmail(e.target.value)} value={email}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">PASSWORD</label>
                    <div className="flex items-center gap-2 border border-gray-200  rounded-xl px-4 py-3 mt-1">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        className="w-full outline-none bg-transparent text-sm"
                          onChange={(e)=>setPassword(e.target.value)} value={password}
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
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 flex items-center justify-center gap-2  bg-gradient-to-r from-orange-500 to-purple-600 text-white py-2 text-md rounded-xl"
                >
                  Create account <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center gap-3 my-5">
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-xs text-gray-400">OR</span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>

                <motion.button                   whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 border border-gray-100 shadow-lg bg-white rounded-xl py-3 text-sm font-medium">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
                  Sign up with Google
                </motion.button>

                <p className="text-center text-xs text-gray-400 mt-5">
                  By continuing you agree to our{' '}
                  <span className="underline cursor-pointer">Terms</span> and{' '}
                  <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
              </div>

              <p className="text-center mt-6 text-gray-500 text-sm">
                Already have an account?{' '}
                <span className="text-pink-600 font-medium cursor-pointer">Login →</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating animated bag bottom-right */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 right-6 opacity-20 pointer-events-none"
      >
       <img src='./favicon.ico' className='w-40 h-40'></img>
      </motion.div>
    </div>
  )
}

export default RegisterPage