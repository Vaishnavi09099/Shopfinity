"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
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

export default function AddProduct() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // ✅ Wearable
  const [isWearable, setIsWearable] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);

  // ✅ POLICY STATES
  const [replacementDay, setReplacementDay] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [warranty, setWarranty] = useState("");
  const [payOnDelivery, setPayOnDelivery] = useState(false);

  const [detailPoints, setDetailPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState("");
  const [pointIndex, setPointIndex] = useState(0);

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);

  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
  const [preview4, setPreview4] = useState("");

  const [loading, setLoading] = useState(false);

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // ✅ ADD DETAIL POINT WITH INDEX
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

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !image1 ||
      !image2 ||
      !image3 ||
      !image4
    ) {
      alert("All fields & 4 images are required");
      return;
    }

    if (isWearable && sizes.length === 0) {
      alert("Please select at least one size");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append(
        "category",
        category === "Others" ? customCategory : category
      );

      formData.append("isWearable", String(isWearable));
      sizes.forEach((size) => formData.append("sizes", size));

      // ✅ POLICY FIELDS
      formData.append("replacementDay", replacementDay);
      formData.append("freeDelivery", String(freeDelivery));
      formData.append("warranty", warranty);
      formData.append("payOnDelivery", String(payOnDelivery));

      // ✅ DETAIL POINTS ARRAY
      detailPoints.forEach((point) => formData.append("detailsPoints", point));

      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);
      formData.append("image4", image4);

      await axios.post("/api/vendor/addProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product added successfully. Waiting for admin approval.");
      router.push("/");
    } catch (error: any) {
      console.log("ADD PRODUCT ERROR:", error);
      alert(error?.response?.data?.message || "❌ Product add failed");
    } finally {
      setLoading(false);
    }
  };

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
            New Listing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Add a{" "}
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
              placeholder="Product Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors bg-white text-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
              placeholder="Price (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
              placeholder="Stock Quantity"
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
            placeholder="What makes this product special?"
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

          {/* ✅ POLICY OPTIONS */}
          <div className="mt-8">
            <SectionLabel>Policies</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
                placeholder="Replacement Days (e.g. 7)"
                type="number"
                value={replacementDay}
                onChange={(e) => setReplacementDay(e.target.value)}
              />

              <input
                className="p-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-pink-400 transition-colors"
                placeholder="Warranty (e.g. 1 Year)"
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
            <SectionLabel>Images (4 required)</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => {
                const previews = [preview1, preview2, preview3, preview4];
                const setters = [setImage1, setImage2, setImage3, setImage4];
                const previewSetters = [setPreview1, setPreview2, setPreview3, setPreview4];

                return (
                  <div key={n}>
                    <input
                      type="file"
                      hidden
                      id={`img${n}`}
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setters[n - 1](f);
                        previewSetters[n - 1](URL.createObjectURL(f));
                      }}
                    />
                    <label
                      htmlFor={`img${n}`}
                      className="cursor-pointer block bg-gray-50 p-2 rounded-2xl text-center h-28 flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-pink-300 transition-colors"
                    >
                      {previews[n - 1] ? (
                        <Image
                          src={previews[n - 1]}
                          alt="img"
                          width={120}
                          height={120}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 text-xs gap-1">
                          <FiUpload size={20} />
                          <span>Image {n}</span>
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
                placeholder={`Point ${pointIndex + 1}`}
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
                  Add Product <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}