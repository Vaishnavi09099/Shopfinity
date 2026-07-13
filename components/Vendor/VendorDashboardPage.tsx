"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import getAllOrdersData from "@/hooks/useGetAllOrdersData";
import getAllProductsData from "@/hooks/useGetAllProducts";
import useGetMe from "@/hooks/useGetMe";
import {
  FiUsers,
  FiBox,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";



export default function VendorDashboardPage() {


  getAllOrdersData()
  getAllProductsData()
  useGetMe()

  const { userData } = useSelector((state: RootState) => state.user);
  const { allOrderData } = useSelector((state: RootState) => state.order);
  const { allProductData } = useSelector((state: RootState) => state.vendor);

  /* ================= ACCESS ================= */
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-purple-50 to-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (userData.role !== "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-purple-50 to-white">
        <p className="text-gray-600 font-medium">Access Denied</p>
      </div>
    );
  }

  /* ================= DATA ================= */
  const vendorOrders = allOrderData.filter(
    (o: any) =>
      String(o.productVendor?._id || o.productVendor) ===
      String(userData._id)
  );

  const vendorProducts = allProductData.filter(
    (p: any) =>
      String(p.vendor?._id || p.vendor) === String(userData._id)
  );

  const validOrders = vendorOrders.filter(
    (o: any) =>
      o.orderStatus !== "cancelled" &&
      o.orderStatus !== "returned"
  );

  let totalSales = 0;
  const customers = new Set<string>();
  validOrders.forEach((o: any) => {
    totalSales += o.totalAmount;
    customers.add(String(o.buyer?._id || o.buyer));
  });

  /* ================= BAR DATA ================= */
  const ordersDateMap: Record<string, number> = {};
  validOrders.forEach((o: any) => {
    const d = new Date(o.createdAt).toLocaleDateString("en-IN");
    ordersDateMap[d] = (ordersDateMap[d] || 0) + 1;
  });

  const ordersByDate = Object.keys(ordersDateMap).map((d) => ({
    date: d,
    orders: ordersDateMap[d],
  }));

  /* ================= LINE DATA ================= */
  const productSalesMap: Record<string, number> = {};
  validOrders.forEach((o: any) =>
    o.products.forEach((p: any) => {
      const t = p.product?.title || "Unknown";
      productSalesMap[t] = (productSalesMap[t] || 0) + p.quantity;
    })
  );

  const productSales = Object.keys(productSalesMap).map((t) => ({
    product: t.length > 12 ? t.slice(0, 12) + "..." : t,
    sold: productSalesMap[t],
  }));

  /* ================= PIE DATA ================= */
  const statusData = [
    {
      name: "Delivered",
      value: vendorOrders.filter(o => o.orderStatus === "delivered").length,
      color: "text-green-500",
    },
    {
      name: "Pending",
      value: vendorOrders.filter(
        o => !["delivered","cancelled","returned"].includes(o.orderStatus)
      ).length,
      color: "text-purple-500",
    },
    {
      name: "Cancelled",
      value: vendorOrders.filter(o => o.orderStatus === "cancelled").length,
      color: "text-red-500",
    },
    {
      name: "Returned",
      value: vendorOrders.filter(o => o.orderStatus === "returned").length,
      color: "text-orange-500",
    },
  ];

  const PIE_COLORS = ["#22c55e", "#9333ea", "#ef4444", "#f97316"];

  /* ================= UI ================= */
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 bg-gradient-to-br from-orange-50 via-purple-50 to-white">
      <div className="max-w-full mx-auto space-y-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-500 p-6 shadow-lg shadow-purple-200/50">
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {userData.shopName}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 break-all mt-1">
              {userData.email}
            </p>
          </div>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* MAIN STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox title="Customers" value={customers.size} icon={<FiUsers />} />
          <StatBox title="Products" value={vendorProducts.length} icon={<FiBox />} />
          <StatBox title="Orders" value={validOrders.length} icon={<FiShoppingBag />} />
          <StatBox title="Sales" value={`₹ ${totalSales}`} icon={<FiTrendingUp />} />
        </div>

        {/* ================= PIE + STATUS (ABOVE OTHER GRAPHS) ================= */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm shadow-purple-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Order Status Overview
          </h2>

          {/* STATUS BOXES INSIDE SAME CARD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {statusData.map((s) => (
              <div
                key={s.name}
                className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center"
              >
                <p className="text-xs text-gray-400">{s.name}</p>
                <p className={`text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* PIE CHART */}
          <div className="h-[260px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #f3e8ff",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= OTHER GRAPHS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* BAR */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-4 h-[260px] sm:h-[320px] shadow-sm shadow-purple-100">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Orders by Date
            </h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={ordersByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #f3e8ff",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#9333ea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LINE */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-4 h-[260px] sm:h-[320px] shadow-sm shadow-purple-100">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Product Sales
            </h2>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={productSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                <XAxis
                  dataKey="product"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #f3e8ff",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sold"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ fill: "#f97316", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= STAT BOX ================= */
function StatBox({ title, value, icon }: { title: string; value: any; icon: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm shadow-purple-100 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase text-gray-400 tracking-wide">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}