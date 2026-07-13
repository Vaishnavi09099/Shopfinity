"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Store, Package, ShoppingBag, IndianRupee, Clock, Box } from "lucide-react";
import getAllOrdersData from "@/hooks/useGetAllOrdersData";
import useGetAllVendors from "@/hooks/useGetAllVendors";

export default function AdminDashboardPage() {
 useGetAllVendors();
   getAllOrdersData();

  const { allVendorData, allProductData } = useSelector((state: RootState) => state.vendor);
  const { allOrderData } = useSelector((state: RootState) => state.order);

  const vendors = allVendorData || [];

  const pendingVendors = vendors.filter((v: any) => v.verificationStatus === "pending");

  const pendingProducts = allProductData.filter((p: any) => p.verificationStatus === "pending");

  const deliveredOrders = allOrderData.filter((o: any) => o.orderStatus === "delivered");
  const cancelledOrders = allOrderData.filter((o: any) => o.orderStatus === "cancelled");
  const returnedOrders = allOrderData.filter((o: any) => o.orderStatus === "returned");
  const remainingOrders = allOrderData.filter(
    (o: any) => !["delivered", "cancelled", "returned"].includes(o.orderStatus)
  );

  let totalEarnings = 0;
  deliveredOrders.forEach((o: any) => {
    if (o.isPaid) totalEarnings += o.totalAmount;
  });

  const vendorOrderMap: Record<string, number> = {};
  allOrderData.forEach((o: any) => {
    const name = o.productVendor?.shopName || "Unknown";
    vendorOrderMap[name] = (vendorOrderMap[name] || 0) + 1;
  });

  const vendorOrderGraph = Object.keys(vendorOrderMap).map((name) => ({
    vendor: name.length > 14 ? name.slice(0, 14) + "..." : name,
    orders: vendorOrderMap[name],
  }));

  const orderProgress = [
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: remainingOrders.length },
    { name: "Cancelled", value: cancelledOrders.length },
    { name: "Returned", value: returnedOrders.length },
  ];

  const COLORS = ["#22c55e", "#a855f7", "#ef4444", "#f97316"];

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
        Admin / Dashboard
      </div>
      <h1 className="text-3xl font-extrabold mb-8">
        <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </span>
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatBox icon={<Store className="w-4 h-4" />} title="Total Vendors" value={vendors.length} gradient="from-orange-500 to-pink-500" />
        <StatBox icon={<Clock className="w-4 h-4" />} title="Pending Vendors" value={pendingVendors.length} gradient="from-amber-500 to-orange-500" />
        <StatBox icon={<Box className="w-4 h-4" />} title="Total Products" value={allProductData.length} gradient="from-pink-500 to-rose-500" />
        <StatBox icon={<Package className="w-4 h-4" />} title="Pending Products" value={pendingProducts.length} gradient="from-amber-500 to-yellow-500" />
        <StatBox icon={<ShoppingBag className="w-4 h-4" />} title="Total Orders" value={allOrderData.length} gradient="from-purple-500 to-fuchsia-600" />
        <StatBox icon={<IndianRupee className="w-4 h-4" />} title="Total Earnings" value={`₹${totalEarnings}`} gradient="from-indigo-500 to-purple-600" />
      </div>

      {/* ================= VENDOR DETAILS ================= */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Vendor Breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {vendors.map((vendor: any) => {
          const vendorProducts = allProductData.filter(
            (p: any) => String(p.vendor?._id || p.vendor) === String(vendor._id)
          );

          const vendorOrders = allOrderData.filter(
            (o: any) => String(o.productVendor?._id || o.productVendor) === String(vendor._id)
          );

          const cancelled = vendorOrders.filter((o: any) => o.orderStatus === "cancelled").length;
          const returned = vendorOrders.filter((o: any) => o.orderStatus === "returned").length;

          let vendorEarning = 0;
          vendorOrders.forEach((o: any) => {
            if (o.orderStatus === "delivered" && o.isPaid) {
              vendorEarning += o.totalAmount;
            }
          });

          return (
            <div
              key={vendor._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {vendor.shopName?.slice(0, 2).toUpperCase() || "??"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 truncate">{vendor.shopName}</h3>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      vendor.verificationStatus === "approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {vendor.verificationStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <MiniStat label="Products" value={vendorProducts.length} />
                <MiniStat label="Orders" value={vendorOrders.length} />
                <MiniStat label="Cancelled" value={cancelled} color="text-red-500" />
                <MiniStat label="Returned" value={returned} color="text-orange-500" />
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Earnings</span>
                <span className="font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  ₹{vendorEarning}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= GRAPHS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR GRAPH */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-[320px] sm:h-[380px]">
          <h2 className="font-bold text-gray-900 mb-3 text-sm">Vendor-wise Orders</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={vendorOrderGraph}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="vendor"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }}
              />
              <Bar dataKey="orders" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE + STATUS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">Order Status Distribution</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatusBox label="Delivered" value={deliveredOrders.length} color="text-green-600" bg="bg-green-50" />
            <StatusBox label="Pending" value={remainingOrders.length} color="text-purple-600" bg="bg-purple-50" />
            <StatusBox label="Cancelled" value={cancelledOrders.length} color="text-red-600" bg="bg-red-50" />
            <StatusBox label="Returned" value={returnedOrders.length} color="text-orange-600" bg="bg-orange-50" />
          </div>

          <div className="h-[220px] sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderProgress} dataKey="value" nameKey="name" outerRadius={80} label>
                  {orderProgress.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatBox({
  icon,
  title,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  value: any;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-2`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{title}</p>
      <p className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, color = "text-gray-800" }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-2 py-1.5">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className={`font-bold ${color}`}>{value}</p>
    </div>
  );
}

function StatusBox({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-extrabold ${color}`}>{value}</p>
    </div>
  );
}