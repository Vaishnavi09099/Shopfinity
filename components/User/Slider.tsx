"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import shop1 from '@/public/heroImages/shop1.jpg'
import shop2 from '@/public/heroImages/shop2.jpg'
import shop3 from '@/public/heroImages/shop3.jpg'
import shop4 from '@/public/heroImages/shop4.jpg'
import { useRouter } from "next/navigation";

const slides = [
  {
    image: shop1,
    title: "Fashion That",
    subtitle: "Speaks Your Style",
    description: "Trending styles at amazing prices.",
    button: "SHOP FASHION",
  },
  {
    image: shop2,
    title: "Gadgets That",
    subtitle: "Power Your World",
    description: "Latest tech, delivered fast.",
    button: "EXPLORE TECH",
  },
  {
    image: shop3,
    title: "Step Into",
    subtitle: "Infinite Style",
    description: "Fresh sneaker drops every week.",
    button: "EXPLORE DROPS",
  },
  {
    image: shop4,
    title: "Beauty,",
    subtitle: "Curated For You",
    description: "Luxury beauty for every look.",
    button: "SHOP BEAUTY",
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mx-auto h-screen   overflow-hidden bg-black">
      {/* All images always mounted, opacity + scale controls visibility -> no gap/peeking ever */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className={`object-cover opacity-70 transition-transform duration-[6000ms] ease-out ${
              index === current ? "scale-110" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Overlay content */}
      <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-10 md:px-24 bg-gradient-to-r from-black/70 to-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xs md:text-base uppercase tracking-widest text-gray-300">
              {slides[current].subtitle}
            </h3>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 mt-2 text-white">
              {slides[current].description}
            </h1>

            <p className="text-xs md:text-xl text-gray-300 mb-6">
              {slides[current].title}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 hover:bg-blue-600 text-white text-sm rounded-3xl shadow-lg transition"
              onClick={() => router.push("/category")}
            >
              {slides[current].button}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail navigation */}
      <div className="absolute bottom-6 right-6 z-30 flex gap-4">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            onClick={() => setCurrent(index)}
            whileHover={{ scale: 1.1 }}
            className={`relative w-20 h-12 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === current
                ? "border-gray-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                : "border-gray-500 hover:border-blue-400"
            }`}
          >
            <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-90" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}