"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { setUserData } from "@/redux/userSlice";
import getCurrentUser from "@/hooks/useGetMe";
import {
  User,
  Mail,
  MapPin,
  Pencil,
  Camera,
  Package,
  Settings,
  LogOut,
  Sparkles,
  Store,
  X,
  Loader2,
  Hash,
  Phone,
} from "lucide-react";
import { signOut } from "next-auth/react";

type TabType = "overview" | "orders" ;

export default function ProfilePage() {
  const router = useRouter();
  getCurrentUser();
  const user = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditShop, setShowEditShop] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [shopName, setShopName] = useState(user?.shopName || "");
  const [businessAddress, setBusinessAddress] = useState(user?.shopAddress || "");
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(user?.image || "/default-user.png");

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (profileImage) formData.append("image", profileImage);

    setLoading(true);
    try {
      const result = await axios.post("/api/user/update-profile", formData);
      dispatch(setUserData(result.data));
      setShowEditProfile(false);
      setProfileImage(null);
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.log(error);
      alert("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleEditShopDetails = async () => {
    if (!shopName || !businessAddress || !gstNumber) {
      alert("All fields are required");
      return;
    }
    setLoading1(true);
    try {
      await axios.post("/api/vendor/verifyAgain", {
        shopName,
        businessAddress,
        gstNumber,
      });
      alert("Verification request sent again ✅");
      router.refresh();
      setShowEditShop(false);
    } catch (error) {
      console.log(error);
      alert("Failed to send verification ❌");
    } finally {
      setLoading1(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  const sidebarItems =
    user.role === "admin"
      ? [
          { id: "overview" as TabType, label: "Overview", icon: <Sparkles className="w-4 h-4" /> },
        
        ]
      : user.role === "vendor"
      ? [
          { id: "overview" as TabType, label: "Overview", icon: <Sparkles className="w-4 h-4" /> },
         
        ]
      : [
          { id: "overview" as TabType, label: "Overview", icon: <Sparkles className="w-4 h-4" /> },
          { id: "orders" as TabType, label: "My Orders", icon: <Package className="w-4 h-4" /> },
        
        ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 px-4 pt-24 pb-10 text-gray-800"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ---------------- HEADER CARD ---------------- */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-br from-orange-200/60 via-pink-200/60 to-purple-300/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              {user?.image ? (
                <Image src={previewImage} alt="profile" width={120} height={120} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-purple-500 text-white text-4xl font-bold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-white/80 px-3 py-1 rounded-full mb-2 text-purple-600">
                {user.role}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {user.phone || "-"}
                </span>
              </div>

             
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* My Orders - only for shopper, same as original file 1 */}
            {user.role === "shopper" && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/orders")}
                className="flex items-center gap-2 bg-white/90 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm border border-white/60"
              >
                <Package className="w-3.5 h-3.5" /> My Orders
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setShowEditProfile(true);
                setShowEditShop(false);
                handleUpdateProfile
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Profile
            </motion.button>
          </div>
        </motion.div>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60 h-fit">
            <div className="flex flex-col gap-2">
              {sidebarItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "orders") {
                        router.push("/orders");
                        return;
                      }
                      setActiveTab(item.id);
                    }}
                    className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon} {item.label}
                    </span>
                  </button>
                );
              })}

              {user.role === "vendor" && (
                <button
                  onClick={() => {
                    setShowEditShop(true);
                    setShowEditProfile(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Store className="w-4 h-4" /> Edit Shop Details
                </button>
              )}

              <div className="h-px bg-gray-100 my-2" />

              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="md:col-span-3 bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/60">
            {activeTab === "overview" && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Overview
                </div>
                <h2 className="text-2xl font-extrabold mb-1">
                  <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                    Welcome back, {user.name?.split(" ")[0]}
                  </span>
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Here's a summary of your account details.
                </p>

                {/* Account details - real data, same fields as original file 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
                  <InfoCard icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone || "-"} />

                  {user.role === "vendor" && (
                    <>
                      <InfoCard icon={<Store className="w-4 h-4" />} label="Shop Name" value={user.shopName || "-"} />
                      <InfoCard icon={<MapPin className="w-4 h-4" />} label="Shop Address" value={user.shopAddress || "-"} />
                      <InfoCard icon={<Hash className="w-4 h-4" />} label="GST No" value={user.gstNumber || "-"} />
                    </>
                  )}
                </div>
              </div>
            )}

          
          </div>
        </div>
      </div>

      {/* ---------------- EDIT PROFILE MODAL ---------------- */}
      <AnimatePresence>
        {showEditProfile && (
          <ModalWrapper onClose={() => setShowEditProfile(false)}>
            <h3 className="text-xl font-extrabold mb-5">
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                Edit Profile
              </span>
            </h3>

            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                <Image src={previewImage} alt="Select Image" width={120} height={120} className="object-cover w-full h-full" />
              </div>
              <label className="cursor-pointer flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-xs font-semibold text-gray-700">
                <Camera className="w-3.5 h-3.5" /> Change Image
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 tracking-wide">FULL NAME</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <input
                    className="w-full outline-none bg-transparent text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 tracking-wide">PHONE</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 mt-1">
                  <input
                    className="w-full outline-none bg-transparent text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold py-3 rounded-2xl mt-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Update Profile"}
              </motion.button>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* ---------------- EDIT SHOP DETAILS MODAL ---------------- */}
      <AnimatePresence>
        {showEditShop && user.role === "vendor" && (
          <ModalWrapper onClose={() => setShowEditShop(false)}>
            <h3 className="text-xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                Edit Shop Details
              </span>
            </h3>

            <p className="text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs mb-5">
              ⚠ After updating shop details, admin verification will take 2–3 hours again.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 tracking-wide">SHOP NAME</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 mt-1">
                  <Store className="w-4 h-4 text-gray-400" />
                  <input
                    className="w-full outline-none bg-transparent text-sm"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Shop Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 tracking-wide">SHOP ADDRESS</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <input
                    className="w-full outline-none bg-transparent text-sm"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Shop Address"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 tracking-wide">GST NUMBER</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 mt-1">
                  <input
                    className="w-full outline-none bg-transparent text-sm"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    placeholder="GST Number"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditShopDetails}
                disabled={loading1}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold py-3 rounded-2xl mt-2 disabled:opacity-60"
              >
                {loading1 ? <Loader2 className="animate-spin w-4 h-4" /> : "Update Shop Details"}
              </motion.button>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center text-purple-500 flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const ModalWrapper = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
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
      className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-white/60 max-h-[85vh] overflow-y-auto"
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
        <X className="w-5 h-5" />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

