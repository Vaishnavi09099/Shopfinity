"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/models/product.model";
import axios from "axios";

export default function UserProductCard({ product }: { product: IProduct }) {
  const router = useRouter();

  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);

  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState(false);

  const openProduct = () => {
    router.push(`/view-product/${product._id}`);
  };

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ card click se bache

    try {
      const res = await axios.post("/api/user/cart/add", {
        productId: product._id,
        quantity: 1,
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

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
  };

  const reviews = product.reviews ?? [];
  const totalReviews = reviews.length;

  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.1 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={openProduct}
    >
      {/* ================= IMAGE BOX ================= */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden group">
        <Image
          src={images[current]}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 300px"
        />



        {/* ✅ HEART / WISHLIST (top-right) */}
        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${liked ? "fill-pink-500 text-pink-500" : "text-gray-500"}`}
          />
        </button>

        {/* ✅ SLIDER ARROWS - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronLeft size={10} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronRight size={10} />
            </button>

            {/* ✅ DOTS */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    current === i ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ================= PRODUCT INFO ================= */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-0.5 truncate">
          {product.vendor?.shopName || "Unknown Shop"}
        </p>

        <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1.5">{product.title}</h3>

        {/* ⭐ REVIEWS */}
        <div className="flex items-center gap-1 text-xs mb-2">
          <FaStar className="text-amber-400 w-3 h-3" />
          <span className="font-semibold text-gray-800">{avgRating}</span>
          <span className="text-gray-400">({totalReviews > 999 ? "1.2k" : totalReviews})</span>
        </div>

        {/* Price row + cart button */}
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-lg bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              ₹{product.price}
            </span>
           
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-full bg-gray-900 hover:bg-black text-white flex items-center justify-center flex-shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}