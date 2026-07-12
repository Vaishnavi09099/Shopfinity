"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";

import { Phone, Mail, Package } from "lucide-react";
import getAllOrdersData from "@/hooks/useGetAllOrdersData";

export default function AllOrdersPage() {
  // Fetch all orders
  getAllOrdersData();

  const { allOrderData } = useSelector((state: RootState) => state.order);

  const orders = allOrderData || [];

  // Format date
  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ STATUS COLOR HELPER
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      case "returned":
        return "bg-orange-100 text-orange-600";
      case "confirmed":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-amber-100 text-amber-600"; // pending
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
        Admin / Orders
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            All Orders
          </span>
        </h1>
        <span className="text-sm font-semibold text-gray-500 bg-white/70 px-4 py-2 rounded-full border border-white/60">
          {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          No Orders Found
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden sm:block overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Order ID</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Buyer</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Vendor</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Products</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Amount</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Payment</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Status</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-gray-800">
                      #{String(order._id).slice(-8)}
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-800 capitalize">{order.address?.name}</p>
                      <p className="text-xs text-gray-400">{order.address?.phone}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {order.productVendor?.shopName || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">{order.productVendor?.email || "no email"}</p>
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {order.products.map((p: any, i: number) => (
                        <div key={i}>
                          {p.product?.title} × {p.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                        ₹{order.totalAmount}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-700 uppercase">{order.paymentMethod}</p>
                      <p className={`text-xs font-semibold ${order.isPaid ? "text-green-600" : "text-amber-600"}`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="sm:hidden space-y-4">
            {orders.map((order: any) => (
              <motion.div
                key={order._id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">#{String(order._id).slice(-8)}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className="font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                    ₹{order.totalAmount}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-sm text-gray-700">
                    <b className="text-gray-900">Buyer:</b> {order.address?.name}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {order.address?.phone}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-700">
                    <b className="text-gray-900">Vendor:</b> {order.productVendor?.shopName}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {order.productVendor?.email}
                  </p>
                </div>

                <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                  <Package className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    {order.products.map((p: any, i: number) => (
                      <p key={i}>
                        {p.product?.title} × {p.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-700 uppercase">{order.paymentMethod}</span>{" "}
                    <span className={`text-xs font-semibold ${order.isPaid ? "text-green-600" : "text-amber-600"}`}>
                      ({order.isPaid ? "Paid" : "Pending"})
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}