"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IProduct } from "@/models/product.model";
import { X, ArrowRight, Loader2 } from "lucide-react";

const categories = [
  "Fashion & Lifestyle",
  "Electronics & Gadgets",
  "Home & Living",
  "Beauty & Personal Care",
  "Toys, Kids & Baby",
  "Food & Grocery",
  "Sports & Fitness",
  "Automotive Accessories",
  "Gifts & Handcrafts",
  "Books & Stationery",
  "Others",
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-extrabold tracking-widest text-pink-600 uppercase mb-3">
      {children}
    </p>
  );
}

export default function UpdateProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { allProductData } = useSelector((state: RootState) => state.vendor);

  const product: IProduct | undefined = allProductData?.find(
    (p: any) => String(p._id) === String(productId)
  );

  // ✅ BASIC
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // ✅ WEARABLE
  const [isWearable, setIsWearable] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);

  // ✅ POLICIES
  const [replacementDays, setReplacementDays] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [warranty, setWarranty] = useState("");
  const [payOnDelivery, setPayOnDelivery] = useState(false);

  // ✅ DETAIL POINTS
  const [detailPoints, setDetailPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState("");
  const [pointIndex, setPointIndex] = useState(0);

  // ✅ IMAGES
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);

  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
  const [preview4, setPreview4] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ PREFILL FROM REDUX
  useEffect(() => {
    if (!product) return;

    setTitle(product.title);
    setDescription(product.description);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setCategory(product.category);

    setIsWearable(Boolean(product.isWearable));
    setSizes(product.sizes || []);

    setReplacementDays(product.replacementDay ? String(product.replacementDay) : "");
    setFreeDelivery(Boolean(product.freeDelivery));
    setWarranty(product.warranty || "");
    setPayOnDelivery(Boolean(product.payOnDelivery));

    setDetailPoints(product.detailsPoints || []);
    setPointIndex(product.detailsPoints?.length || 0);

    setPreview1(product.image1);
    setPreview2(product.image2);
    setPreview3(product.image3);
    setPreview4(product.image4);
  }, [product]);

  // ✅ SIZE TOGGLE
  const toggleSize = (size: string) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  // ✅ ADD DETAIL POINT
  const handleAddPoint = () => {
    if (!currentPoint.trim()) return;

    setDetailPoints((prev) => {
      const updated = [...prev];
      updated[pointIndex] = currentPoint;
      return updated;
    });

    setCurrentPoint("");
    setPointIndex((prev) => prev + 1);
  };

  // ✅ REMOVE DETAIL POINT
  const handleRemovePoint = (i: number) => {
    setDetailPoints((prev) => prev.filter((_, index) => index !== i));
  };

  // ✅ UPDATE SUBMIT
  const handleSubmit = async () => {
    if (!title || !description || !price || !stock || !category) {
      alert("All required fields must be filled");
      return;
    }

    if (isWearable && sizes.length === 0) {
      alert("Please select at least one size");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("productId", productId);

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category === "Others" ? customCategory : category);

      formData.append("isWearable", String(isWearable));
      sizes.forEach((size) => formData.append("sizes", size));

      formData.append("replacementDays", replacementDays);
      formData.append("freeDelivery", String(freeDelivery));
      formData.append("warranty", warranty);
      formData.append("payOnDelivery", String(payOnDelivery));

      detailPoints.forEach((point) => formData.append("detailsPoints", point));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      await axios.put("/api/vendor/updateProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated & sent for re-approval");
      router.push("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 px-4 pt-24 pb-16">
      {/* Blobs */}
      <div className="absolute w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/3 -right-20 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 bottom-0 left-1/4 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-2xl mx-auto bg-white rounded-3xl border border-white/60 shadow-xl overflow-hidden"
      >
        {/* HEADER STRIP */}
        <div className="bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 px-6 sm:px-10 py-6">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            Edit Listing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Update{" "}
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Product
            </span>
          </h1>
        </div>

        <div className="px-6 sm:px-10 py-8">
          {/* BASICS */}
          <SectionLabel>Basics</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors bg-white text-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <input
              className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {category === "Others" && (
            <input
              className="mt-4 w-full p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
              placeholder="Enter Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}

          <textarea
            className="w-full mt-4 p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors resize-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* ✅ WEARABLE */}
          <div className="mt-8">
            <SectionLabel>Wearable</SectionLabel>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isWearable}
                onChange={() => setIsWearable(!isWearable)}
                className="w-4 h-4 accent-pink-600"
              />
              <span className="text-sm text-gray-700">This is a wearable / clothing product</span>
            </label>

            {isWearable && (
              <div className="mt-4 flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                      sizes.includes(size)
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ✅ POLICIES */}
          <div className="mt-8">
            <SectionLabel>Policies</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
                placeholder="Replacement Days"
                type="number"
                value={replacementDays}
                onChange={(e) => setReplacementDays(e.target.value)}
              />
              <input
                className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
                placeholder="Warranty"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeDelivery}
                  onChange={() => setFreeDelivery(!freeDelivery)}
                  className="w-4 h-4 accent-pink-600"
                />
                <span className="text-sm text-gray-700">Free Delivery</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={payOnDelivery}
                  onChange={() => setPayOnDelivery(!payOnDelivery)}
                  className="w-4 h-4 accent-pink-600"
                />
                <span className="text-sm text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* ✅ IMAGES */}
          <div className="mt-8">
            <SectionLabel>Update Images</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[preview1, preview2, preview3, preview4].map((img, i) => {
                const setters = [setImage1, setImage2, setImage3, setImage4];
                const previewSetters = [setPreview1, setPreview2, setPreview3, setPreview4];

                return (
                  <div key={i}>
                    <input
                      type="file"
                      hidden
                      id={`updimg${i}`}
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setters[i](f);
                        previewSetters[i](URL.createObjectURL(f));
                      }}
                    />
                    <label
                      htmlFor={`updimg${i}`}
                      className="cursor-pointer block bg-gray-50 p-2 rounded-2xl text-center h-28 flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-pink-300 transition-colors"
                    >
                      {img ? (
                        <Image
                          src={img}
                          alt="img"
                          width={120}
                          height={120}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 text-xs gap-1">
                          <FiUpload size={20} />
                          <span>Image {i + 1}</span>
                        </div>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ✅ DETAIL POINTS */}
          <div className="mt-8">
            <SectionLabel>Product Detail Points</SectionLabel>

            <div className="flex gap-2">
              <input
                className="flex-1 p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
                value={currentPoint}
                onChange={(e) => setCurrentPoint(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddPoint}
                className="px-5 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-2xl text-sm font-semibold"
              >
                Add
              </button>
            </div>

            {detailPoints.length > 0 && (
              <ul className="mt-3 space-y-2">
                {detailPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-2xl"
                  >
                    <span className="text-sm text-gray-700">
                      {i + 1}. {point}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(i)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex gap-3 mt-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-semibold py-3 rounded-2xl disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Update Product <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}