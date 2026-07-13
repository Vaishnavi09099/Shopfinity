"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Check,
  ChevronRight,
  Trash2,
  Wallet,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { FaStripe } from "react-icons/fa";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();

  const productId = useMemo(() => {
    if (!params?.id) return null;
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>(1);

  // Address
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // "card" | "upi" -> maps to stripe, "cod" -> maps to cod
  const [paymentMode, setPaymentMode] = useState<"cod" |"stripe">("cod");

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        const res = await axios.get("/api/user/cart/get");
        const found = res.data.cart.find((i: any) => i.product._id === productId);

        if (!found) {
          router.replace("/cart");
          return;
        }

        setItem(found);
        if (!found.product.payOnDelivery) {
          setPaymentMode("stripe");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  if (!productId || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading checkout...</p>
      </div>
    );
  }

  if (!item) return null;

  const productsTotal = item.product.price * item.quantity;
  const deliveryCharge = item.product.freeDelivery ? 0 : 50;
  const serviceCharge = 30;
  const finalTotal = productsTotal + deliveryCharge + serviceCharge;

  const codDisabled = !item.product.payOnDelivery;

  const goToPayment = () => {
    if (!name || !phone || !address || !city || !pincode) {
      alert("Please fill all address fields");
      return;
    }
    setStep(2);
  };

  const goToReview = () => setStep(3);

  const handlePlaceOrder = async () => {
    const finalMode = paymentMode === "cod" ? "cod" : "stripe";

    const payload = {
      productId,
      quantity: item.quantity,
      address: { name, phone, address, city, pincode },
      amount: finalTotal,
      deliveryCharge,
      serviceCharge,
    };

    try {
      if (finalMode === "cod") {
        await axios.post("/api/order/cod", payload);
        router.replace("/orders");
      } else {
        const res = await axios.post("/api/order/online-pay", payload);
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 px-4 pt-24 pb-16">
      {/* Blobs */}
      <div className="absolute w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/3 -right-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          <StepPill
            active={step === 1}
            done={step > 1}
            number={1}
            label="Address"
            icon={<MapPin className="w-4 h-4" />}
            onClick={() => setStep(1)}
          />
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <StepPill
            active={step === 2}
            done={step > 2}
            number={2}
            label="Payment"
            icon={<CreditCard className="w-4 h-4" />}
            onClick={() => step > 1 && setStep(2)}
          />
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <StepPill
            active={step === 3}
            done={false}
            number={3}
            label="Review"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => step > 2 && setStep(3)}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT — STEP CONTENT */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-5"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-extrabold text-gray-900">Delivery Address</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-pink-400 transition-colors"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-pink-400 transition-colors"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <textarea
                    className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-pink-400 transition-colors resize-none"
                    rows={3}
                    placeholder="Complete Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-pink-400 transition-colors"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                      className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-pink-400 transition-colors"
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToPayment}
                    className="w-full bg-gradient-to-r from-purple-700 via-pink-500 to-orange-500 text-white font-bold py-3 rounded-2xl shadow-md"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-extrabold text-gray-900">Payment Method</h2>
                  </div>

                  <PaymentOption
                    selected={paymentMode === "stripe"}
                    onClick={() => setPaymentMode("stripe")}
                    icon={<FaStripe className="w-5 h-5 text-white" />}
                       iconBg="bg-blue-400"
                    title="Stripe"
                    subtitle="Pay Online for hazzle free delivery"
                  />

                 

                  <PaymentOption
                    selected={paymentMode === "cod"}
                    onClick={() => !codDisabled && setPaymentMode("cod")}
                    icon={<Truck className="w-5 h-5 text-gray-600" />}
                    iconBg="bg-gray-100"
                    title="Cash on Delivery"
                    subtitle="Pay when your order arrives"
                    disabled={codDisabled}
                  />


                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToReview}
                    className="w-full bg-gradient-to-r from-purple-700 via-pink-500 to-orange-500 text-white font-bold py-3 rounded-2xl shadow-md mt-2"
                  >
                    Continue to Review
                  </motion.button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-5"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-extrabold text-gray-900">Your Items </h2>
                  </div>

                  <div className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4">
                    <img
                      src={item.product.image1}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.product.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{productsTotal}</p>
                  </div>

               

                  <div className="h-px bg-gray-100" />

                  <div className="text-sm text-gray-500">
                    <p className="font-semibold text-gray-800 mb-1">Delivering to:</p>
                    <p>{name}, {address}, {city} - {pincode}</p>
                    <p>{phone}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-bold text-base py-3 rounded-2xl shadow-md"
                  >
                    {paymentMode === "cod" ? "Place Order" : "Proceed to Secure Payment"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT — SUMMARY (always visible across steps) */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-lg font-extrabold text-gray-900 mb-4">Order Summary</h2>

            

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal ({item.quantity} item{item.quantity > 1 ? "s" : ""})</span>
                  <span className="text-gray-800 font-medium">₹{productsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-purple-600 font-semibold" : "text-gray-800 font-medium"}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span className="text-gray-800 font-medium">₹{serviceCharge}</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-4" />

              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  ₹{finalTotal}
                </span>
              </div>

              {item.product.freeDelivery && (
                <div className="bg-purple-50 text-purple-700 text-xs font-semibold rounded-2xl px-4 py-2.5 text-center">
                  You're saving on delivery charges 🎉
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 grid grid-cols-3 gap-2">
              <TrustBadge icon={<ShieldCheck className="w-5 h-5" />} label="Secure Pay" />
              <TrustBadge icon={<Truck className="w-5 h-5" />} label="Fast Ship" />
              <TrustBadge icon={<CheckCircle2 className="w-5 h-5" />} label="Easy Returns" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating animated bag bottom-right */}
<motion.div
  animate={{ y: [0, -20, 0] }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  className="absolute bottom-6 right-6 opacity-20 pointer-events-none"
>
  <img className="w-40 h-40" src="/favicon.ico" alt="bag" />
</motion.div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

const StepPill = ({
  active,
  done,
  number,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  done: boolean;
  number: number;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      active
        ? "bg-gradient-to-r from-purple-700 via-pink-500 to-orange-500 text-white shadow-md"
        : done
        ? "bg-purple-100 text-purple-700"
        : "bg-white/70 text-gray-400 border border-white/60"
    }`}
  >
    <span
      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
        active ? "bg-white/25" : done ? "bg-purple-600 text-white" : "bg-gray-200"
      }`}
    >
      {done ? <Check className="w-3 h-3" /> : number}
    </span>
    {icon} {label}
  </button>
);

const PaymentOption = ({
  selected,
  onClick,
  icon,
  iconBg,
  title,
  subtitle,
  disabled = false,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
      selected ? "border-purple-400 bg-purple-50/50" : "border-gray-200 hover:border-gray-300"
    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
  >
    <span
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        selected ? "border-purple-600" : "border-gray-300"
      }`}
    >
      {selected && <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
    </span>
    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
    <div>
      <p className="font-semibold text-sm text-gray-900">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  </button>
);

const TrustBadge = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-2xl py-4">
    <div className="text-purple-600">{icon}</div>
    <span className="text-[11px] font-semibold text-gray-700 text-center">{label}</span>
  </div>
);