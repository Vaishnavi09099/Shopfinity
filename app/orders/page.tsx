"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { motion, AnimatePresence } from "framer-motion";
import { FiTruck, FiSearch, FiDownload, FiChevronRight, FiPackage, FiCheckCircle, FiMapPin } from "react-icons/fi";
import { setAllOrderData } from "@/redux/orderSlice";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { IUser } from "@/models/user.model";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const { userData } = useSelector((state: RootState) => state.user);
  const { allOrderData } = useSelector((state: RootState) => state.order);

  const [loading, setLoading] = useState(true);
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackOrderModal, setTrackOrderModal] = useState<any | null>(null);
  const [returnModalOrder, setReturnModalOrder] = useState<any | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);

  // UI-only state (search + filter)
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // -----------------------------
  // Fetch Orders
  // -----------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await axios.get("/api/order/allOrder");
        const orders = Array.isArray(result.data)
          ? result.data
          : result.data.orders || [];

        dispatch(setAllOrderData(orders));
      } catch (err) {
        console.log("Order Fetch Error:", err);
        dispatch(setAllOrderData([]));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    setLocalOrders(allOrderData || []);
  }, [allOrderData]);

  // -----------------------------
  // Filter Orders
  // -----------------------------
  const userOrders = useMemo(() => {
    if (!userData) return [];
    return localOrders.filter((o) => {
      const buyerId = o?.buyer?._id ?? o.buyer;
      return String(buyerId) === String(userData._id);
    });
  }, [localOrders, userData]);

  // UI-only: search + status filter (does not touch business logic)
  const displayedOrders = useMemo(() => {
    let list = userOrders;

    if (activeFilter !== "all") {
      list = list.filter((o) => o.orderStatus === activeFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter((o) => {
        const idMatch = String(o._id).toLowerCase().includes(q);
        const productMatch = o.products?.some((p: any) =>
          p.product?.title?.toLowerCase().includes(q)
        );
        return idMatch || productMatch;
      });
    }

    return list;
  }, [userOrders, activeFilter, searchText]);

  const stats = useMemo(() => {
    const total = userOrders.length;
    const delivered = userOrders.filter((o) => o.orderStatus === "delivered").length;
    const active = userOrders.filter(
      (o) => o.orderStatus === "pending" || o.orderStatus === "confirmed" || o.orderStatus === "shipped"
    ).length;
    return { total, delivered, active };
  }, [userOrders]);

  // Format date
  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isReturnEligible = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) return false;

    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry =
      deliveredAt + replacementDays * 24 * 60 * 60 * 1000;

    return Date.now() <= expiry;
  };

  const getRemainingReturnDays = (
    deliveryDate: string,
    replacementDays: number
  ) => {
    if (!deliveryDate || !replacementDays) return 0;

    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry =
      deliveredAt + replacementDays * 24 * 60 * 60 * 1000;

    const diff = expiry - Date.now();
    if (diff <= 0) return 0;

    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

  const getReturnEndDate = (
    deliveryDate: string,
    replacementDays: number
  ) => {
    if (!deliveryDate || !replacementDays) return null;

    const deliveredAt = new Date(deliveryDate);
    deliveredAt.setDate(deliveredAt.getDate() + replacementDays);

    return deliveredAt;
  };

  const handleRequestReturn = async (orderId: string) => {
    setReturnModalOrder(localOrders.find((o) => o._id === orderId));
    setReturnReason("");
  };

  const submitReturnRequest = async () => {
    if (!returnModalOrder) return;
    if (!returnReason.trim()) {
      alert("Please provide a reason for the return request.");
      return;
    }

    try {
      setReturnLoading(true);
      const res = await axios.post("/api/order/request-return", {
        orderId: returnModalOrder._id,
        reason: returnReason.trim(),
      });

      const updatedOrder = res.data.order;
      const updatedOrders = localOrders.map((o: any) =>
        o._id === returnModalOrder._id
          ? {
              ...o,
              orderStatus: updatedOrder.orderStatus,
              returnReason: updatedOrder.returnReason,
              rejectionReason: updatedOrder.rejectionReason,
            }
          : o
      );

      setLocalOrders(updatedOrders);
      dispatch(setAllOrderData(updatedOrders));
      if (selectedOrder?._id === returnModalOrder._id) {
        setSelectedOrder({ ...selectedOrder, ...updatedOrder });
      }
      setReturnModalOrder(null);
      setReturnReason("");
      alert("Return request submitted successfully. Our team will review it shortly.");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Return request failed");
    } finally {
      setReturnLoading(false);
    }
  };

  const getReturnActionLabel = (status: string) => {
    switch (status) {
      case "return_requested":
        return "Return Requested";
      case "return_approved":
        return "Refund Approved";
      case "return_rejected":
        return "Return Rejected";
      case "returned":
        return "Refunded";
      default:
        return "Request Return";
    }
  };

  // -----------------------------
  // TRACK ORDER STEPS (Shopfinity themed)
  // -----------------------------
const statusStepMap: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  return_requested: "Return Requested",
  return_approved: "Return Approved",
  return_rejected: "Return Rejected",
  returned: "Returned",
};


  const renderTrackStep = (currentStatus: string) => {
    const steps = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "return_requested",
      "return_approved",
      "return_rejected",
      "returned",
    ];
    const currentIndex = steps.indexOf(currentStatus);

    return (
      <div className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {steps.map((status, i) => {
            const reached = currentIndex >= i;
            const isLast = i === steps.length - 1;

            return (
              <React.Fragment key={status}>
                <div className="flex flex-col items-center min-w-[76px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                      reached
                        ? "bg-gradient-to-br from-orange-500 to-purple-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {reached ? <FiCheckCircle size={16} /> : i + 1}
                  </div>
                  <div className="text-[11px] mt-2 text-gray-500 capitalize text-center">
                    {statusStepMap[status]}
                  </div>
                </div>

                {!isLast && (
                  <div
                    className={`h-1.5 min-w-[30px] flex-1 rounded-full ${
                      currentIndex > i
                        ? "bg-gradient-to-r from-orange-500 to-purple-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Cancel logic
  const isCancelDisabled = (order: any) =>
    order.isPaid === true && order.paymentMethod === "stripe";

  const handleCancelOrder = async (orderId: string) => {
    try {
      await axios.post("/api/order/cancel", { orderId });

      const updatedOrders = localOrders.map((o: any) =>
        o._id === orderId ? { ...o, orderStatus: "cancelled" } : o
      );
      alert("Order Cancelled");
      setSelectedOrder(null);
      setLocalOrders(updatedOrders);
      dispatch(setAllOrderData(updatedOrders));
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cancel failed");
    }
  };



  // Status badge styling
  const statusBadge = (status: string) => {
    switch (status) {
      case "shipped":
        return { label: "Shipped", cls: "bg-purple-100 text-purple-700", icon: <FiTruck size={14} /> };
      case "delivered":
        return { label: "Delivered", cls: "bg-green-100 text-green-700", icon: <FiCheckCircle size={14} /> };
      case "cancelled":
        return { label: "Cancelled", cls: "bg-red-100 text-red-600", icon: null };
      case "return_requested":
        return { label: "Return Requested", cls: "bg-amber-100 text-amber-700", icon: null };
      case "return_approved":
        return { label: "Return Approved", cls: "bg-sky-100 text-sky-700", icon: null };
      case "return_rejected":
        return { label: "Return Rejected", cls: "bg-rose-100 text-rose-700", icon: null };
      case "returned":
        return { label: "Returned", cls: "bg-yellow-100 text-yellow-700", icon: null };
      case "confirmed":
        return { label: "Confirmed", cls: "bg-blue-100 text-blue-700", icon: <FiPackage size={14} /> };
      default:
        return { label: "Pending", cls: "bg-orange-100 text-orange-700", icon: <FiPackage size={14} /> };
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-purple-50 to-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-300 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const filterPills = [

    { key: "all", label: "All" },
    { key: "confirmed", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];
  

  const navbarUser = session?.user as IUser | undefined;

  return (
    <>
      <Navbar user={navbarUser} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-white pt-24 sm:pt-28 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-500 p-6 sm:p-8 mb-6 shadow-2xl shadow-purple-200/50">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-white/80 text-sm">Welcome back{userData?.name ? `, ${userData.name}` : ""}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">My Orders</h1>
              <p className="text-white/80 text-sm mt-1">Track, manage and reorder in a tap</p>
            </div>

            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-[11px] text-white/80">Total</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-white">{stats.delivered}</div>
                <div className="text-[11px] text-white/80">Delivered</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-white">{stats.active}</div>
                <div className="text-[11px] text-white/80">Active</div>
              </div>
            </div>
          </div>

          <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl px-4 py-3 shadow-sm">
            <FiSearch className="text-gray-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search orders or products..."
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filterPills.map((f) => {
              const active = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md shadow-purple-200"
                      : "bg-white/70 text-gray-600 border border-white/60 hover:bg-white"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ORDER LIST */}
        <div className="space-y-5">
          {displayedOrders.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-10 text-center text-gray-400 shadow-xl ">
              No orders found
            </div>
          ) : (
            displayedOrders.map((order: any) => {
              const vendorName = order.productVendor?.shopName || "—";
              const badge = statusBadge(order.orderStatus);

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{y:-3}}
                  className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl shadow-purple-100 overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                      <span className="text-sm text-gray-700 font-medium">
                        Order #{String(order._id).slice(-8)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Placed {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="text-lg font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                      ₹{order.totalAmount}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col lg:flex-row gap-4 p-5">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-white shrink-0">
                        <img
      src={order.products[0]?.product?.image1 || order.image1}
      alt="product"
      className="w-full h-full object-cover"
    />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Sold by {vendorName}</p>
                          {order.products.map((p: any, i: number) => (
                            <div key={i} className="text-sm text-gray-700">
                              {p.product?.title || p.product?._id} × {p.quantity}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs mt-2">
                        <span className="text-gray-400">Payment:</span>
                        <span className="font-medium text-gray-600">{order.paymentMethod?.toUpperCase()}</span>
                        <span className={order.isPaid ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>

                      {order.orderStatus === "returned" && (
                        <div className="text-xs text-green-600 font-medium">
                          Refunded: ₹{order.returnedAmount}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {order.orderStatus !== "cancelled" && (
                      <div className="flex flex-col gap-2 lg:w-56 shrink-0">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition"
                        >
                          Check Details <FiChevronRight />
                        </button>

                        <button
                          disabled={order.orderStatus === "delivered"}
                          onClick={() =>
                            order.orderStatus !== "delivered" && setTrackOrderModal(order)
                          }
                          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                            order.orderStatus === "delivered"
                              ? "bg-green-50 text-green-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:opacity-90"
                          }`}
                        >
                          <FiTruck />
                          {order.orderStatus === "delivered" ? "Delivered" : "Track Order"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline progress for shipped/pending/confirmed */}
                  {["pending", "confirmed", "shipped"].includes(order.orderStatus) && (
                    <div className="px-5 pb-5">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            {order.orderStatus === "shipped" ? "On the way" : "Being prepared"}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FiMapPin size={12} /> {vendorName}
                          </span>
                        </div>
                        {renderTrackStep(order.orderStatus)}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* ---------------------- */}
        {/* CHECK DETAILS MODAL */}
        {/* ---------------------- */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setSelectedOrder(null)}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-lg font-bold text-gray-800">
                  Order Details #{String(selectedOrder._id).slice(-10)}
                </h2>

                <p className="text-sm text-gray-400">{formatDate(selectedOrder.createdAt)}</p>

                <hr className="my-4 border-gray-100" />
             

                {/* Products */}
                <h3 className="font-semibold mb-2 text-gray-700">Products</h3>
                {selectedOrder.products.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-xl mb-2">
                    <div>
                      <div className="font-medium text-gray-700">{p.product?.title}</div>
                      <div className="text-xs text-gray-400">
                        Qty: {p.quantity} • Price: ₹{p.price}
                      </div>
                    </div>

                    <div className="font-semibold text-purple-600">
                      ₹{p.quantity * p.price}
                    </div>
                  </div>
                ))}

                <hr className="my-4 border-gray-100" />

                {/* Billing */}
                <h3 className="font-semibold mb-2 text-gray-700">Invoice</h3>

                <div className="text-sm space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>Products Total</span>
                    <span>₹{selectedOrder.productsTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>₹{selectedOrder.deliveryCharge}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Service Charge</span>
                    <span>₹{selectedOrder.serviceCharge}</span>
                  </div>

                  <hr className="my-2 border-gray-100" />

                  <div className="flex justify-between font-bold text-purple-700 text-base">
                    <span>Final Total</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>



                {selectedOrder.orderStatus === "delivered"
                 &&
                  selectedOrder.deliveryDate && (
                    <div className="mt-3 text-sm text-green-600 font-medium">
                      Delivered on:{" "}
                      {new Date(selectedOrder.deliveryDate).toLocaleDateString("en-IN")}
                    </div>
                  )}

                {/* IMPORTANT NOTE */}
                {selectedOrder.isPaid == true && selectedOrder.paymentMethod == "stripe" && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs rounded-xl p-3 mt-4">
                    <p className="font-semibold mb-1">Important Note:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        Order cancellation feature is <b>not available if payment is done
                          using Online Payment (Stripe)</b>.
                      </li>
                      <li>You can only <b>return the product</b> after delivery.</li>
                      <li>On return, you will receive only the <b>product amount</b>.</li>
                      <li><b>Delivery & service charges are non-refundable.</b></li>
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200"
                  >
                    Close
                  </button>

                  <button
                    disabled={selectedOrder.orderStatus === "delivered"}
                    onClick={() =>
                      selectedOrder.orderStatus !== "delivered" &&
                      setTrackOrderModal(selectedOrder)
                    }
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition ${
                      selectedOrder.orderStatus === "delivered"
                        ? "bg-green-50 text-green-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:opacity-90"
                    }`}
                  >
                    <FiTruck />
                    {selectedOrder.orderStatus === "delivered"
                      ? "Delivered"
                      : "Track Order"}
                  </button>

           
                 {/* RETURN / CANCEL BUTTON */}
{selectedOrder.orderStatus === "returned" || selectedOrder.orderStatus === "cancelled" ? null :
selectedOrder.orderStatus === "delivered" ? (
  (() => {
    const deliveryDate = selectedOrder.deliveryDate;

    return selectedOrder.products.map((p: any, i: number) => {
      const replacementDays = p.product?.replacementDay || 0;

      const eligible = isReturnEligible(deliveryDate, replacementDays);
      const remaining = getRemainingReturnDays(deliveryDate, replacementDays);
      const returnEndDate = getReturnEndDate(deliveryDate, replacementDays);

      return (
        <div
          key={i}
          className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl"
        >
          <div>
            <p className="text-xs text-gray-500">{p.product?.title}</p>

            {eligible ? (
              <>
                <p className="text-xs text-yellow-600 font-medium">
                  Return available for {remaining} day
                  {remaining > 1 ? "s" : ""}
                </p>

                {returnEndDate && (
                  <p className="text-[11px] text-gray-400">
                    Return till:{" "}
                    {returnEndDate.toLocaleDateString("en-IN")}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-red-500">Return window closed</p>
            )}
          </div>

          {eligible && (
            <button
              onClick={() => handleRequestReturn(selectedOrder._id)}
              className="mx-3 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
            >
              Request Return
            </button>
          )}
        </div>
      );
    });
  })()
) : ["return_requested", "return_approved", "return_rejected"].includes(selectedOrder.orderStatus) ? (
  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
    <div className="font-semibold">{getReturnActionLabel(selectedOrder.orderStatus)}</div>
    <div className="text-xs mt-1">
      {selectedOrder.orderStatus === "return_requested"
        ? "Your return request is under review."
        : selectedOrder.orderStatus === "return_approved"
          ? "Your return has been approved and refund processing is underway."
          : "Your return request was rejected. Please contact support for help."}
    </div>
  </div>
) : (
  <button
    disabled={isCancelDisabled(selectedOrder)}
    onClick={() => handleCancelOrder(selectedOrder._id)}
    className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
      isCancelDisabled(selectedOrder)
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-red-500 text-white hover:bg-red-600"
    }`}
  >
    Cancel Order
  </button>
)}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------------------- */}
        {/* RETURN REQUEST MODAL */}
        {/* ---------------------- */}
        <AnimatePresence>
          {returnModalOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setReturnModalOrder(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-2xl"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">Return Request</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Please tell us why you’d like to return order <strong>#{String(returnModalOrder._id).slice(-8)}</strong>.
                </p>

                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-200 rounded-3xl p-4 text-sm text-gray-700 outline-none focus:border-purple-400 transition-colors"
                  placeholder="Enter return reason"
                />

                <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setReturnModalOrder(null)}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReturnRequest}
                    disabled={returnLoading}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-60"
                  >
                    {returnLoading ? "Submitting..." : "Submit Return Request"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------------------- */}
        {/* TRACK ORDER MODAL */}
        {/* ---------------------- */}
        <AnimatePresence>
          {trackOrderModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setTrackOrderModal(null)}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-2xl"
              >
                <h2 className="text-lg font-bold text-gray-800">Track Order</h2>

                <p className="text-sm text-gray-500 mb-4 leading-relaxed mt-2">
                  <span className="font-semibold text-gray-700">{trackOrderModal.address.name}</span>
                  <br />
                  {trackOrderModal.address.address},<br />
                  {trackOrderModal.address.city}, {trackOrderModal.address.state} -{" "}
                  {trackOrderModal.address.pincode}
                  <br />
                  Phone: {trackOrderModal.address.phone}
                </p>

                {/* STATUS TRACK */}
                {renderTrackStep(trackOrderModal.orderStatus)}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setTrackOrderModal(null)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}