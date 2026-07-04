'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Store, ShieldCheck, Check, Phone, ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Role = 'shopper' | 'vendor' | 'admin'

const roles: { id: Role; title: string; desc: string; icon: React.ReactNode; gradient: string }[] = [
  {
    id: 'shopper',
    title: 'Shopper',
    desc: 'Discover and shop from a variety of items.',
    icon: <ShoppingBag className="w-6 h-6 text-white" />,
    gradient: 'from-orange-500 to-pink-500',
  },
  {
    id: 'vendor',
    title: 'Vendor',
    desc: 'Start selling your products and grow your business.',
    icon: <Store className="w-6 h-6 text-white" />,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'admin',
    title: 'Admin',
    desc: 'Manage, monitor, and oversee the marketplace.',
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    gradient: 'from-purple-600 to-fuchsia-600',
  },
]

const EditRoleMobile = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('shopper')
  const [phone, setPhone] = useState('')
  const [adminExists, setAdminExists] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if Admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('/api/admin/check-admin')
        setAdminExists(res.data.exists) // true / false
      } catch (error) {
        console.log('Admin check error:', error)
      }
    }
    checkAdmin()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRole || !phone) {
      alert('Please select a role and enter your phone number.')
      return
    }

    if (selectedRole === 'admin' && adminExists) {
      alert('❌ Admin already exists. You cannot select Admin role.')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/user/edit-role-mobile', { role: selectedRole, phone })
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-pink-100 to-purple-200 flex flex-col">
      <div className="absolute w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/3 -right-20 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 bottom-0 left-1/4 pointer-events-none" />

      {/* Navbar */}
      <div className="flex items-center justify-between px-40 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <img className="w-6 h-5" src="./favicon.ico" alt="logo" />
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Shopfinity
          </span>
        </div>
        <button type="button" className="text-gray-700 font-medium">
          Cancel
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center px-4 mt-4">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-wide bg-white/70 backdrop-blur px-4 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          UPDATE YOUR PROFILE
        </span>
        <h1 className="text-5xl font-extrabold mb-3">
          Edit{' '}
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            role & mobile
          </span>
        </h1>
        <p className="text-gray-500 max-w-lg text-md">
          Pick the role that fits you best and add a mobile number for order updates & OTP.
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: role */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <h2 className="text-xl font-bold">Choose your role</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {roles.map((role) => {
                const isAdminBlocked = role.id === 'admin' && adminExists

                return (
                  <motion.div
                    key={role.id}
                    whileHover={!isAdminBlocked ? { y: -3 } : {}}
                    onClick={() => {
                      if (isAdminBlocked) {
                        alert('⚠️ Admin already exists. You cannot select Admin role.')
                        return
                      }
                      setSelectedRole(role.id)
                    }}
                    className={`cursor-pointer relative text-left hover:bg-gradient-to-tr from-orange-100 via-pink-100 to-purple-100 bg-white/70 rounded-3xl p-5 border-1 shadow-lg transition-colors ${
                      selectedRole === role.id ? 'border-pink-500' : 'border-gray-100'
                    } ${isAdminBlocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4`}
                    >
                      {role.icon}
                    </div>

                    {selectedRole === role.id ? (
                      <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="absolute top-5 right-5 w-6 h-6 rounded-full border-2 border-gray-300" />
                    )}

                    <h3 className="font-bold text-lg mb-1">{role.title}</h3>
                    <p className="text-xs text-gray-500">
                      {isAdminBlocked ? 'Admin already exists' : role.desc}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Step 2: mobile */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <h2 className="text-xl font-bold">Add your mobile number</h2>
            </div>

            <label className="text-xs font-semibold text-gray-500 tracking-wide">PHONE</label>
            <div className="flex items-center gap-3 mt-1 mb-2">
              <div className="flex items-center justify-center border rounded-3xl border-gray-400/50 px-4 py-3 font-medium text-gray-600">
                +91
              </div>
              <div className="flex items-center gap-2 border-gray-400/50 border rounded-3xl px-4 py-3 flex-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  maxLength={10}
                  required
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="92********"
                  className="w-full outline-none bg-transparent text-sm"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-semibold py-3 rounded-3xl disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Now'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Floating animated bag bottom-right */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 right-6 opacity-20 pointer-events-none"
      >
        <img className="w-40 h-40" src="./favicon.ico" alt="bag" />
      </motion.div>
    </div>
  )
}

export default EditRoleMobile