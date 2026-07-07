'use client'

import { IUser } from '@/models/user.model'
import React from 'react'
import { motion } from 'framer-motion'
import { HiClock, HiXCircle, HiCheckCircle } from 'react-icons/hi'

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
        message="Unfortunately your vendor account verification was rejected. Please contact support for more details or to reapply."
        badge="Rejected"
        badgeColor="text-red-600 bg-red-100"
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
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  message: string
  badge: string
  badgeColor: string
}) => (
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

      <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
    </motion.div>
  </div>
)

export default VendorPage