"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { label: "Fashion & Lifestyle", src: "/categories/pic1.jpg" },
  { label: "Electronics & Gadgets", src: "/categories/pic2.jpg" },
  { label: "Home & Living", src: "/categories/pic9.jpg" },
  { label: "Beauty & Personal Care", src: "/categories/pic3.jpg" },
  { label: "Toys, Kids & Baby", src: "/categories/pic4.jpg" },
  { label: "Food & Grocery", src: "/categories/pic5.jpg" },
  { label: "Sports & Fitness", src: "/categories/pic10.jpg" },
  { label: "Automotive Accessories", src: "/categories/pic6.jpg" },
  { label: "Gifts & Handcrafts", src: "/categories/pic7.jpg" },
  { label: "Books & Stationery", src: "/categories/pic8.jpg" },
];

const PAGE_SIZE = 5;

export default function CategoriesSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    setStartIndex((prev) => (prev + PAGE_SIZE) % categories.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - PAGE_SIZE < 0 ? categories.length - PAGE_SIZE : prev - PAGE_SIZE
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleCategories = categories.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className="mt-20 w-[95vw] mx-auto"
    >
      {/* Heading */}
      <div className="w-[90%] mx-auto mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-600 uppercase">
          Explore
        </span>
        <div className="flex items-center gap-2 mt-1">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Shop by{" "}
            <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 bg-clip-text text-transparent">
              category
            </span>
          </h2>
        </div>
      </div>

      {/* Slider wrapper */}
      <div className="relative w-[90%] mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={startIndex}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -120 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-12"
          >
            {visibleCategories.map((cat) => (
              <motion.div
                key={cat.label}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-[280px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/category?category=${encodeURIComponent(cat.label)}`
                  )
                }
              >
                {cat.src ? (
                  <img
                    src={cat.src}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gray-200" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white text-lg md:text-xl font-bold drop-shadow-md">
                    {cat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-pink-50 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-pink-600" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-pink-50 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-6 h-6 text-pink-600" />
        </button>
      </div>
    </motion.section>
  );
}