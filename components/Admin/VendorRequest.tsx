"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setAllVendorData } from "@/redux/vendorSlice";

import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Store,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Check,
  X,
} from "lucide-react";
import useGetAllVendors from "@/hooks/useGetAllVendors";

type Vendor = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  verificationStatus?: "pending" | "approved" | "rejected";
};

type FilterType = "all" | "pending" | "approved" | "rejected";

export default function VendorRequest() {
  const dispatch = useDispatch();
  useGetAllVendors();

  const allVendorData: Vendor[] = useSelector(
    (state: any) => state.vendor.allVendorData
  );

  const vendors = Array.isArray(allVendorData) ? allVendorData : [];

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("pending");

  const total = vendors.length;
  const pendingCount = vendors.filter((v) => v.verificationStatus === "pending").length;
  const approvedCount = vendors.filter((v) => v.verificationStatus === "approved").length;
  const rejectedCount = vendors.filter((v) => v.verificationStatus === "rejected").length;

  const filteredVendors = vendors.filter((v) => {
    const matchesFilter = filter === "all" ? true : v.verificationStatus === filter;
    const matchesSearch =
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ✅ APPROVE
  const handleApprove = async () => {
    if (!selectedVendor) return;

    try {
      setLoading(true);

   await axios.post("/api/admin/update-vendor-status", {
        vendorId: selectedVendor._id,
        status: "approved",
      });


      const updated = allVendorData.map((v) =>
        v._id === selectedVendor._id ? { ...v, verificationStatus: "approved" as const } : v
      );
      dispatch(setAllVendorData(updated));

      setSelectedVendor(null);
      setLoading(false);
      alert("Vendor Approved ✅");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Approval failed ❌");
    }
  };

  // ❌ OPEN REJECT FORM
  const openRejectForm = () => {
    setRejectReason("");
    setShowRejectModal(true);
  };

  // ❌ CONFIRM REJECTION
  const confirmReject = async () => {
    if (!selectedVendor || !rejectReason.trim()) {
      alert("Rejection reason required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/admin/update-vendor-status", {
        vendorId: selectedVendor._id,
        status: "rejected",
        rejectedReason: rejectReason,
      });

      const updated = allVendorData.map((v) =>
        v._id === selectedVendor._id ? { ...v, verificationStatus: "rejected" as const } : v
      );
      dispatch(setAllVendorData(updated));

      setShowRejectModal(false);
      setSelectedVendor(null);
      setLoading(false);
      alert("Vendor Rejected ❌");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Rejection failed ❌");
    }
  };

  const timeAgo = () => ""; // no requestedAt field in this Vendor type currently

  const initials = (name?: string) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "??";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
        Admin / Vendor Approval
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">
            <span className="text-orange-500">Vendor</span>{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Approval
            </span>
          </h1>
          <p className="text-gray-500 text-sm">
            Review new vendor applications and activate stores.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-white/60 text-sm font-semibold text-gray-700">
          <TrendingUp className="w-4 h-4 text-pink-500" />
          {pendingCount} pending review
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={total} />
        <StatCard label="Pending" value={pendingCount} />
        <StatCard label="Approved" value={approvedCount} />
        <StatCard label="Rejected" value={rejectedCount} />
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 bg-white rounded-full px-4 py-3 shadow-sm border border-white/60">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors, owners, categories..."
            className="w-full outline-none bg-transparent text-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white rounded-full p-1.5 shadow-sm border border-white/60 overflow-x-auto">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
          <FilterTab label="All" count={total} active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterTab label="Pending" count={pendingCount} active={filter === "pending"} onClick={() => setFilter("pending")} />
          <FilterTab label="Approved" count={approvedCount} active={filter === "approved"} onClick={() => setFilter("approved")} />
          <FilterTab label="Rejected" count={rejectedCount} active={filter === "rejected"} onClick={() => setFilter("rejected")} />
        </div>
      </div>

      {/* List + Detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Vendor list */}
        <div className="flex flex-col gap-3">
          {filteredVendors.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-400 text-sm shadow-sm border border-white/60">
              No vendor requests found.
            </div>
          ) : (
            filteredVendors.map((vendor) => {
              const isSelected = selectedVendor?._id === vendor._id;
              return (
                <button
                  key={vendor._id}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`flex items-center gap-4 text-left rounded-2xl p-4 shadow-sm border transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 border-transparent"
                      : "bg-white border-white/60 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-gradient-to-br from-orange-400 to-pink-500 text-white"
                    }`}
                  >
                    {initials(vendor.shopName || vendor.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
                      {vendor.shopName || "Unnamed Shop"}
                    </p>
                    <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                      {vendor.name}
                    </p>
                    <div className={`flex items-center gap-1 text-[11px] mt-1 ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                      <MapPin className="w-3 h-3" />
                      {vendor.shopAddress || "—"}
                    </div>
                  </div>

                  <StatusPill status={vendor.verificationStatus} inverted={isSelected} />
                </button>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        {selectedVendor ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-white/60 h-fit">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    VND-{selectedVendor._id.slice(-4)}
                  </p>
                  <p className="text-xl font-extrabold text-gray-900">
                    {selectedVendor.shopName || "Unnamed Shop"}
                  </p>
                  <p className="text-sm text-gray-500">by {selectedVendor.name}</p>
                </div>
              </div>
              <StatusPill status={selectedVendor.verificationStatus} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoField icon={Mail} label="Email" value={selectedVendor.email} />
              <InfoField icon={Phone} label="Phone" value={selectedVendor.phone || "—"} />
              <InfoField icon={MapPin} label="Address" value={selectedVendor.shopAddress || "—"} />
              <InfoField icon={FileText} label="GST" value={selectedVendor.gstNumber || "—"} />
            </div>

            {selectedVendor.verificationStatus === "pending" && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  disabled={loading}
                  onClick={handleApprove}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
                >
                  <Check className="w-4 h-4" /> {loading ? "Processing..." : "Approve"}
                </button>
                <button
                  disabled={loading}
                  onClick={openRejectForm}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 text-sm shadow-sm border border-white/60">
            Select a vendor to see details.
          </div>
        )}
      </div>

      {/* ================= REJECT MODAL ================= */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-white/60"
            >
              <h2 className="text-lg font-bold mb-4 text-red-500">
                Reject Vendor
              </h2>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-pink-400"
                rows={4}
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  disabled={loading}
                  onClick={confirmReject}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
                >
                  {loading ? "Processing..." : "Confirm Reject"}
                </button>

                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-full text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Sub-components ---------- */

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow-sm border border-white/60">
    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">
      {label}
    </p>
    <p className="text-3xl font-extrabold text-gray-900">{value}</p>
  </div>
);

const FilterTab = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
      active
        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
        : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {label} {count}
  </button>
);

const StatusPill = ({
  status,
  inverted = false,
}: {
  status?: "pending" | "approved" | "rejected";
  inverted?: boolean;
}) => {
  const styles = {
    pending: inverted ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600",
    approved: inverted ? "bg-white/20 text-white" : "bg-green-100 text-green-600",
    rejected: inverted ? "bg-white/20 text-white" : "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${
        styles[status || "pending"]
      }`}
    >
      <Clock className="w-3 h-3" />
      {status?.toUpperCase()}
    </span>
  );
};

const InfoField = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-purple-500" />
    </div>
    <div>
      <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
        {value}
      </p>
    </div>
  </div>
);
