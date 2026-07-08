'use client'

import { IUser } from '@/models/user.model'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiClock, HiXCircle, HiCheckCircle } from 'react-icons/hi'
import { Store, MapPin, FileText, ArrowRight, X } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import VendorDashboard from './VendorDashboard'

const VendorPage = ({ user }: { user: IUser }) => {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    )
  }

  if (user.verificationStatus === "approved") {
    return (
      <div>
        <VendorDashboard />
      </div>
    )
  }

  if (user.verificationStatus === "pending") {
    return (
      <StatusScreen
        icon={<HiClock size={36} className="text-white" />}
        iconBg="bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600"
        title="Verification Pending"
        message="Your vendor account is under review. You'll get full access to your dashboard once our team approves it — this usually takes 2–3 hours."
        badge="Pending Approval"
        badgeColor="text-pink-600 bg-pink-100"
      />
    )
  }

  if (user.verificationStatus === "rejected") {
    return (
      <StatusScreen
        icon={<HiXCircle size={36} className="text-white" />}
        iconBg="bg-gradient-to-br from-red-500 to-pink-600"
        title="Verification Rejected"
       message={user.rejectedReason || "Unfortunately your vendor account verification was rejected. Please contact support for more details or to reapply."}
        badge="Rejected"
        badgeColor="text-red-600 bg-red-100"
        showReapply
        user={user}
      />
    )
  }

  return (
    <StatusScreen
      icon={<HiCheckCircle size={36} className="text-white" />}
      iconBg="bg-gradient-to-br from-gray-400 to-gray-600"
      title="Something went wrong"
      message="We couldn't determine your verification status. Please try refreshing the page."
      badge="Unknown"
      badgeColor="text-gray-600 bg-gray-100"
    />
  )
}

const StatusScreen = ({
  icon,
  iconBg,
  title,
  message,
  badge,
  badgeColor,
  showReapply = false,
  user,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  message: string
  badge: string
  badgeColor: string
  showReapply?: boolean
  user?: IUser
}) => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 flex items-center justify-center px-4">
      {/* Blobs */}
      <div className="absolute w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/3 -right-20 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 bottom-0 left-1/4 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-lg border border-white/60 text-center"
      >
        <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6 ${badgeColor}`}>
          {badge}
        </span>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md ${iconBg}`}
        >
          {icon}
        </motion.div>

        <h2 className="text-2xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>

        <p className="text-gray-500 text-sm leading-relaxed mb-2">{message}</p>

        {showReapply && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white text-sm font-semibold py-3 rounded-2xl"
          >
            Verify Again <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>

      {/* Reapply Form Modal */}
      <AnimatePresence>
        {showForm && user && (
          <ReapplyModal user={user} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

const ReapplyModal = ({ user, onClose }: { user: IUser; onClose: () => void }) => {
  const router = useRouter()
  const [shopName, setShopName] = useState(user.shopName || "")
  const [shopAddress, setShopAddress] = useState(user.shopAddress || "")
  const [gstNumber, setGstNumber] = useState(user.gstNumber || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shopName || !shopAddress || !gstNumber) {
      alert("Please fill all vendor details")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/vendor/verifyAgain", {
        shopName,
        shopAddress,
        gstNumber,
      })
      alert("Details submitted for review again ✅")
      onClose()
      router.refresh()
    } catch (error: any) {
      console.error("Reapply error:", error.response?.data || error.message)
      alert(error.response?.data?.message || "Something went wrong while resubmitting")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-white/60"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-extrabold mb-1">
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Resubmit shop details
          </span>
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Update your information and submit again for review.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide mb-1">
              <Store className="w-3.5 h-3.5" /> SHOP / BUSINESS NAME <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Trendy Threads"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide mb-1">
              <MapPin className="w-3.5 h-3.5" /> BUSINESS ADDRESS <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              placeholder="Shop address, city, state, pincode"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide mb-1">
              <FileText className="w-3.5 h-3.5" /> GST Number <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              placeholder="Registration number"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white text-sm font-semibold py-3 rounded-2xl disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit for Review"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default VendorPage