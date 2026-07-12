"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { motion } from "framer-motion";
import {
  FiSearch,
  FiGrid,
  FiShoppingBag,
  FiX,
  FiInbox,
} from "react-icons/fi";
import {
  MdOutlineCategory,
  MdOutlineCheckroom,
  MdOutlineDevices,
  MdOutlineChair,
  MdOutlineFace3,
  MdOutlineToys,
  MdOutlineLocalGroceryStore,
  MdOutlineSportsBasketball,
  MdOutlineDirectionsCar,
  MdOutlineCardGiftcard,
  MdOutlineMenuBook,
} from "react-icons/md";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { IUser } from "@/models/user.model";

import { useSession } from "next-auth/react";
import axios from "axios";

const categoryList = [
  { label: "all", icon: MdOutlineCategory },
  { label: "Fashion & Lifestyle", icon: MdOutlineCheckroom },
  { label: "Electronics & Gadgets", icon: MdOutlineDevices },
  { label: "Home & Living", icon: MdOutlineChair },
  { label: "Beauty & Personal Care", icon: MdOutlineFace3 },
  { label: "Toys, Kids & Baby", icon: MdOutlineToys },
  { label: "Food & Grocery", icon: MdOutlineLocalGroceryStore },
  { label: "Sports & Fitness", icon: MdOutlineSportsBasketball },
  { label: "Automotive Accessories", icon: MdOutlineDirectionsCar },
  { label: "Gifts & Handcrafts", icon: MdOutlineCardGiftcard },
  { label: "Books & Stationery", icon: MdOutlineMenuBook },
];

export default function CategoriesPage() {
  const { data: session } = useSession();
  const { allVendorData } = useSelector((state: RootState) => state.vendor);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [selectedShopName, setSelectedShopName] = useState("");
  const [search, setSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");

  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [displayProducts, setDisplayProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);


  // ✅ URL se category read (CLIENT ONLY)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setSelectedCategory(cat);
    setIsReady(true); // ✅ IMPORTANT
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("query", search);
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const res = await axios.get(`/api/search?${params.toString()}`);
     

      setApiProducts(res.data.products || []);
      setDisplayProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!isReady) return; //  STOP early call
    fetchProducts();
  }, [selectedCategory, search, isReady]);


  useEffect(() => {
    if (selectedShop === "all") {
      setDisplayProducts(apiProducts);
    } else {
      setDisplayProducts(
        apiProducts.filter(
          (p: any) => String(p.vendor?._id) === String(selectedShop)
        )
      );
    }
  }, [selectedShop, apiProducts]);

  const filteredShops = useMemo(() => {
    if (!shopSearch) return [];
    return allVendorData.filter((v: any) =>
      v.shopName.toLowerCase().includes(shopSearch.toLowerCase())
    );
  }, [shopSearch, allVendorData]);

  const clearShopFilter = () => {
    setSelectedShop("all");
    setSelectedShopName("");
    setShopSearch("");
  };
  

  const navbarUser = session?.user as IUser | undefined;

  return (
    <>
      <Navbar user={navbarUser} />
      <div className="min-h-screen bg-white">
       {/* HERO SECTION */}
      {/* ---------------------- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 px-4 py-16 sm:py-20 text-center">
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-purple-300/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-orange-300/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-200/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto mt-10">
         

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
              Browse Products
            </span>
            <br />
            <span className="text-gray-900">by Categories</span>
          </h1>

          <p className="text-gray-500 mt-5 text-sm sm:text-base max-w-xl mx-auto">
            Discover products by category, search your favorite items, or shop from your preferred store.
          </p>
        </div>
      </div>

      {/* ---------------------- */}
      {/* CONTENT */}
      {/* ---------------------- */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* ✅ LEFT SIDEBAR */}
        <div className="md:col-span-1">
          <div className="md:sticky md:top-6 bg-white border border-gray-100 rounded-2xl p-5 space-y-6 shadow-lg shadow-purple-100/60">

            {/* 🔍 SEARCH */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                Search
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition">
                <FiSearch className="text-gray-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <FiX className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* 📁 CATEGORY */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                  <FiGrid className="text-purple-500" /> Categories
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {categoryList.length}
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {categoryList.map((cat) => {
                  const active = selectedCategory === cat.label;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => {
                        setSelectedCategory(cat.label);
                        setSelectedShop("all"); // ✅ reset shop
                        clearShopFilter();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-md shadow-purple-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={17} className={active ? "text-white" : "text-gray-400"} />
                      <span className="capitalize truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 🏪 SHOP SEARCH */}
            <div>
              <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm mb-3">
                <FiShoppingBag className="text-orange-500" /> Find a Shop
              </div>

              {selectedShop !== "all" ? (
                <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5">
                  <span className="text-sm text-purple-700 font-medium truncate">
                    {selectedShopName}
                  </span>
                  <button onClick={clearShopFilter}>
                    <FiX className="text-purple-500 hover:text-purple-700 shrink-0" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition">
                    <FiSearch className="text-gray-400 shrink-0" />
                    <input
                      value={shopSearch}
                      onChange={(e) => setShopSearch(e.target.value)}
                      placeholder="Search shop..."
                      className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    />
                  </div>

                  {shopSearch && (
                    <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl max-h-52 overflow-y-auto shadow-xl shadow-purple-100 z-20">
                      {filteredShops.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 py-4">
                          No shop found
                        </p>
                      ) : (
                        filteredShops.map((v: any) => (
                          <button
                            key={v._id}
                            onClick={() => {
                              setSelectedShop(v._id);
                              setSelectedShopName(v.shopName);
                              setShopSearch("");
                            }}
                            className="block w-full px-3.5 py-2.5 text-left text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition"
                          >
                            {v.shopName}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ PRODUCTS GRID */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {displayProducts.length}
              </span>{" "}
              {displayProducts.length === 1 ? "Product" : "Products"}
            </p>

            {selectedCategory !== "all" && (
              <span className="text-xs bg-gradient-to-r from-purple-600 to-orange-500 text-white px-3 py-1.5 rounded-full font-medium capitalize">
                {selectedCategory}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]"
                />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 gap-3 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                <FiInbox size={26} />
              </div>
              <p className="text-sm">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayProducts.map((product: any) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    
    </>
  
  );
}