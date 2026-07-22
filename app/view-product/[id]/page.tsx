"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Wallet,
  ShoppingCart,
  Zap,
  Heart,
  BadgeCheck,
  Minus,
  Plus,
  Store,
  Star,
} from "lucide-react";

import { IProduct } from "@/models/product.model";

import axios from "axios";
import getAllProductsData from "@/hooks/useGetAllProducts";
import ProductCard from "@/components/ProductCard";

export default function ProductViewPage() {
  const params = useParams();
  const id = params.id;
  getAllProductsData();
  const router = useRouter();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [productState, setProductState] = useState<IProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const { allProductData } = useSelector((state: RootState) => state.vendor);

  const productFromStore: IProduct | undefined = allProductData?.find(
    (p: IProduct) => String(p._id) === String(id)
  );

  const product = productFromStore || productState;

  // ✅ FIX: useEffect ab yahan hai — kisi bhi early-return se pehle
  // Rules of Hooks: hooks kabhi conditional return ke baad nahi ho sakte
  useEffect(() => {
    if (productFromStore) {
      setProductState(productFromStore);
      setLoadingProduct(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await axios.get("/api/vendor/allProduct");
        const products: IProduct[] = res.data;
        const found = products.find((p) => String(p._id) === String(id));
        setProductState(found || null);
      } catch (error) {
        console.error("Failed to fetch product details", error);
        setProductState(null);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id, productFromStore]);

  // ✅ Loading
  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          />
          <h1 className="text-lg font-semibold text-gray-500">
            Loading product...
          </h1>
        </div>
      </div>
    );
  }

  // ✅ Not Found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <h1 className="text-xl font-semibold text-gray-700">
          ❌ Product Not Found
        </h1>
      </div>
    );
  }

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  const totalReviews = product.reviews?.length ?? 0;

  const avgRating =
    totalReviews > 0
      ? (
          product.reviews!.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      : "0";

  const relatedProducts =
    allProductData?.filter(
      (p) => p?.category === product?.category && p?._id !== product?._id
    ) || [];

  const handleAddToCart = async () => {
    if (!product?._id) return;

    try {
      const res = await axios.post("/api/user/cart/add", {
        productId: product._id,
        quantity,
      });

      if (res.status === 200) {
        alert("✅ Added to cart");
      }
      router.push("/cart");
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Add to cart failed ❌");
    }
  };

  const submitReview = async () => {
    if (!reviewRating || !reviewComment) {
      alert("Rating and comment are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("productId", String(product._id));
      formData.append("rating", String(reviewRating));
      formData.append("comment", reviewComment);

      if (reviewImage) {
        formData.append("image", reviewImage);
      }

      await axios.post("/api/vendor/addReview", formData);

      alert("✅ Review added successfully");
      router.refresh();

      setReviewRating(0);
      setReviewComment("");
      setReviewImage(null);
      setPreview(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  const policyBadges = [
    product.freeDelivery && {
      icon: Truck,
      label: "Free Delivery",
    },
    typeof product.replacementDay === "number" &&
      product.replacementDay > 0 && {
        icon: RotateCcw,
        label: `${product.replacementDay}-Day Replacement`,
      },
    product.warranty &&
      product.warranty !== "No Warranty" && {
        icon: ShieldCheck,
        label: `${product.warranty} yr Warranty`,
      },
    product.payOnDelivery && {
      icon: Wallet,
      label: "Cash on Delivery",
    },
  ].filter(Boolean) as { icon: any; label: string }[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ================== BREADCRUMB ================== */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 mb-6 flex items-center gap-2"
        >
          <span className="hover:text-pink-600 cursor-pointer transition-colors">
            Home
          </span>
          <span>›</span>
          <span className="hover:text-pink-600 cursor-pointer transition-colors">
            {product.category}
          </span>
          <span>›</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </motion.p>

        {/* ================== TOP SECTION ================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ✅ LEFT: IMAGE GALLERY */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-pink-100 shadow-xl bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 overflow-hidden"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={images[activeImage]}
                      alt={product.title}
                      fill
                      className="object-contain p-6"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* ✅ WISHLIST */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setLiked((p) => !p)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    liked ? "fill-pink-500 text-pink-500" : "text-gray-500"
                  }`}
                />
              </motion.button>

              {/* ✅ VERIFIED BADGE */}
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-purple-700 shadow">
                <BadgeCheck className="w-3.5 h-3.5" />
                Verified
              </div>
            </motion.div>

            {/* ✅ THUMBNAILS */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl cursor-pointer overflow-hidden bg-gradient-to-br from-orange-50 to-purple-50 border-2 transition-all ${
                      activeImage === i
                        ? "border-pink-500 shadow-md"
                        : "border-transparent hover:border-pink-200"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.25 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={img}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ RIGHT: PRODUCT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-block text-xs font-bold tracking-wide text-pink-600 bg-pink-100 px-3 py-1 rounded-full mb-3 uppercase">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              {product.title}
            </h1>

            {/* ⭐ RATING */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-gray-900 text-white px-2.5 py-1 rounded-full text-sm font-semibold">
                {avgRating}
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-sm text-gray-500">
                {totalReviews} review{totalReviews !== 1 && "s"}
              </span>
            </div>

            {/* 💰 PRICE */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                ₹{product.price}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* ✅ SIZES */}
            {product.isWearable === true &&
              Array.isArray(product.sizes) &&
              product.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="font-semibold text-gray-800 mb-2">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s: string) => (
                      <motion.button
                        key={s}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                          selectedSize === s
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-200 hover:border-pink-400"
                        }`}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

            {/* ✅ QUANTITY */}
            <div className="mb-6">
              <p className="font-semibold text-gray-800 mb-2">Quantity</p>
              <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ✅ STOCK */}
            <p className="mb-6 text-sm">
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {product.stock > 0
                  ? `In Stock · ${product.stock} left`
                  : "Out of Stock"}
              </span>
            </p>

            {/* ✅ ACTION BUTTONS */}
            <div className="flex gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white py-3.5 rounded-full font-semibold shadow-lg shadow-pink-200 hover:shadow-xl transition-shadow"
              >
                <Zap className="w-4 h-4 fill-white" />
                Buy Now
              </motion.button>
            </div>

            {/* ✅ POLICY BADGES */}
            {policyBadges.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {policyBadges.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-1.5 bg-white rounded-2xl border border-gray-100 py-4 px-2 shadow-sm"
                  >
                    <b.icon className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-gray-600">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ VENDOR CARD */}
            {product.vendor?.shopName && (
              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {product.vendor.shopName}
                    </p>
                    <p className="text-xs text-gray-400">Verified Seller</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-pink-600 hover:text-pink-700">
                  Visit Store
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* ================== HIGHLIGHTS ================== */}
        {Array.isArray(product.detailsPoints) &&
          product.detailsPoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Product Highlights
              </h2>
              <p className="text-gray-500 mb-6">
                Everything you need to know at a glance
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {product.detailsPoints.map((p: string, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {p}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        {/* ================== RELATED PRODUCTS ================== */}
        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Related Products
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {relatedProducts.slice(0, 8).map((rp) => (
                <ProductCard key={rp._id?.toString()} product={rp} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ================== REVIEWS ================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              <p className="text-gray-500">What real buyers are saying</p>
            </div>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold shadow-md">
              <Star className="w-4 h-4 fill-white" />
              {avgRating} / 5
            </div>
          </div>

          {/* ⭐ ADD REVIEW FORM */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-900 font-semibold mb-3">
              Add Your Review
            </p>

            <div className="flex gap-1 mb-4 text-amber-400 text-xl">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.span
                  key={i}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setReviewRating(i)}
                  className="cursor-pointer"
                >
                  {i <= reviewRating ? <FaStar /> : <FaRegStar />}
                </motion.span>
              ))}
            </div>

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review..."
              rows={3}
              className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setReviewImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="mb-3 text-sm text-gray-600"
            />

            {preview && (
              <div className="w-[90px] h-[90px] rounded-lg mb-3 border border-gray-200 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  <Image
                    src={preview}
                    alt="Preview"
                    width={90}
                    height={90}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={submitReview}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-md disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </motion.button>
          </div>

          {/* 📄 EXISTING REVIEWS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {product.reviews && product.reviews.length > 0 ? (
  product.reviews.map((r, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
          {r.user && typeof r.user === "object" && r.user.image ? (
            <Image
              src={r.user.image}
              alt={r.user.name || "User"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-gray-400 w-8 h-8" />
          )}
        </div>

        <div>
          <p className="text-gray-900 font-semibold text-sm">
            {r.user && typeof r.user === "object" ? r.user.name : "Anonymous"}
          </p>
          <div className="flex text-amber-400 text-xs">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= r.rating ? (
                <FaStar key={i} />
              ) : (
                <FaRegStar key={i} />
              )
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">{r.comment}</p>

      {r.image && (
        <div className="w-[160px] h-[160px] border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src={r.image}
              alt="Review Image"
              width={160}
              height={160}
              className="object-contain w-full h-full"
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  ))
) : (
  <p className="text-gray-400 col-span-full text-center py-10">
    No reviews yet. Be the first to review!
  </p>
)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}