"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function UserCartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getCart = async () => {
    try {
      const res = await axios.get("/api/user/cart/get");
      setCart(res.data.cart || []);
    } catch (error) {
      console.log("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const handleRemoveFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product._id !== productId));
    await axios.post("/api/user/cart/remove", { productId });
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    await axios.post("/api/user/cart/update", { productId, quantity });
    getCart();
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Your cart is empty
            </span>
          </h2>
          <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold px-6 py-3 rounded-full"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 px-4 pt-24 pb-16">
      {/* Blobs */}
      <div className="absolute w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/3 -right-20 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          Your Cart
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">
          Shopping{" "}
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Cart
          </span>
        </h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <motion.div
              key={item.product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-sm border border-white/60 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative w-full sm:w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                  src={item.product.image1}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{item.product.title}</h3>
                <p className="text-sm text-gray-500 mb-3">₹ {item.product.price}</p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1.5">
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-pink-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-pink-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(item.product._id)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-500 text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/checkout/${item.product._id}`)}
                  className="mt-3 flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-full"
                >
                  Checkout This Product <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span className="text-xs text-gray-400 sm:hidden">Total</span>
                <p className="font-extrabold text-lg bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  ₹ {item.product.price * item.quantity}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart summary footer */}
        <div className="mt-6 bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white/60 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">Cart Total</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            ₹ {total}
          </span>
        </div>
      </div>
    </div>
  );
}