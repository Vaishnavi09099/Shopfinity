"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setAllOrderData } from "@/redux/orderSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { KeyRound, Package, Phone } from "lucide-react";

export default function VendorOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { allOrderData } = useSelector((state: RootState) => state.order);
  const { userData } = useSelector((state: RootState) => state.user);

  const [otpModal, setOtpModal] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/order/allOrder");
        dispatch(setAllOrderData(res.data.orders || res.data || []));
      } catch {
        dispatch(setAllOrderData([]));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [dispatch]);

  if (!userData || userData.role !== "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Access Denied</p>
      </div>
    );
  }

  const vendorOrders = useMemo(
    () =>
      (allOrderData || []).filter(
        (o: any) => String(o.productVendor?._id || o.productVendor) === String(userData._id)
      ),
    [allOrderData, userData]
  );

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setLoadingId(orderId);
      await axios.post("/api/order/update-status", { orderId, status });
      dispatch(
        setAllOrderData(
          allOrderData.map((o: any) => (o._id === orderId ? { ...o, orderStatus: status } : o))
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const verifyAndDeliver = async () => {
    try {
      setLoadingId(otpModal._id);
      await axios.post("/api/order/verify-delivery-otp", {
        orderId: otpModal._id,
        otp: otpInput,
      });
      dispatch(
        setAllOrderData(
          allOrderData.map((o: any) =>
            o._id === otpModal._id ? { ...o, orderStatus: "delivered" } : o
          )
        )
      );
      setOtpModal(null);
      setOtpInput("");
    } finally {
      setLoadingId(null);
    }
  };

  const statusOptions = ["pending", "confirmed", "shipped", "delivered"];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      cancelled: "bg-red-100 text-red-600",
      delivered: "bg-green-100 text-green-600",
      returned: "bg-orange-100 text-orange-600",
      pending: "bg-amber-100 text-amber-600",
      confirmed: "bg-blue-100 text-blue-600",
      shipped: "bg-purple-100 text-purple-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
     

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Vendor Orders
          </span>
        </h1>
        <span className="text-sm font-semibold text-gray-500 bg-white/70 px-4 py-2 rounded-full border border-white/60">
          {vendorOrders.length} orders
        </span>
      </div>

      {vendorOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          No orders yet.
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Order</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Buyer</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Products</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Payment</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Status</th>
                  <th className="p-4 text-xs font-bold tracking-widest text-gray-400 uppercase text-center">Update</th>
                </tr>
              </thead>
              <tbody>
                {vendorOrders.map((order: any) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="p-4 text-sm font-semibold text-gray-800">#{order._id.slice(-8)}</td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-800">{order.address?.name}</p>
                      <p className="text-xs text-gray-400">{order.address?.phone}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {order.products.map((p: any, i: number) => (
                        <div key={i}>
                          {p.product?.title} × {p.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-700 capitalize">{order.paymentMethod}</p>
                      <p className={`text-xs font-semibold ${order.isPaid ? "text-green-600" : "text-amber-600"}`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {["cancelled", "delivered", "returned"].includes(order.orderStatus) ? (
                        <span className={`text-xs font-semibold capitalize ${statusBadge(order.orderStatus)} px-3 py-1 rounded-full`}>
                          {order.orderStatus}
                        </span>
                      ) : (
                        <select
                          disabled={loadingId === order._id}
                          value={order.orderStatus}
                          onChange={async (e) => {
                            if (e.target.value === "delivered") {
                              await axios.post("/api/order/update-status", {
                                orderId: order._id,
                                status: "delivered",
                              });
                              setOtpModal(order);
                            } else {
                              updateStatus(order._id, e.target.value);
                            }
                          }}
                          className="border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-pink-400"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE BOX UI ================= */}
          <div className="sm:hidden space-y-4">
            {vendorOrders.map((order: any) => (
              <motion.div
                key={order._id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-800">#{order._id.slice(-8)}</span>
                  <span className="font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                    ₹{order.totalAmount}
                  </span>
                </div>

                <p className="text-sm text-gray-700">
                  <b className="text-gray-900">Buyer:</b> {order.address?.name}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {order.address?.phone}
                </p>

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

                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {!["cancelled", "delivered", "returned"].includes(order.orderStatus) && (
                  <select
                    disabled={loadingId === order._id}
                    value={order.orderStatus}
                    onChange={async (e) => {
                      if (e.target.value === "delivered") {
                        await axios.post("/api/order/update-status", {
                          orderId: order._id,
                          status: "delivered",
                        });
                        setOtpModal(order);
                      } else {
                        updateStatus(order._id, e.target.value);
                      }
                    }}
                    className="mt-3 w-full border border-gray-200 rounded-2xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-pink-400"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ================= OTP MODAL ================= */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl w-full max-w-md shadow-xl border border-white/60"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center mb-4">
              <KeyRound className="w-5 h-5 text-white" />
            </div>

            <h2 className="text-xl font-extrabold mb-1">
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                Enter Delivery OTP
              </span>
            </h2>
            <p className="text-sm text-gray-500 mb-5">Ask the customer for their delivery OTP.</p>

            <input
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors mb-4"
              placeholder="Enter OTP"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOtpModal(null);
                  setOtpInput("");
                }}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={verifyAndDeliver}
                disabled={loadingId === otpModal._id}
                className="flex-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-3 rounded-2xl text-sm disabled:opacity-60"
              >
                {loadingId === otpModal._id ? "Verifying..." : "Verify & Deliver"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}