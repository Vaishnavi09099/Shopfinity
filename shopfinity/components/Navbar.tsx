"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlinePhone,
  AiOutlineShop,
  AiOutlineLogin,
  AiOutlineLogout,
} from "react-icons/ai";

import { GoListUnordered } from "react-icons/go";
import { usePathname, useRouter } from "next/navigation";

import { signOut } from "next-auth/react";

import axios from "axios";
import { IUser } from "@/models/user.model";

export default function Navbar({ user }: { user: IUser }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await axios.get("/api/user/cart/get");

      if (res.status === 200) {
        const cart = res.data?.cart || [];
        const totalQty = cart.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );

        setCartCount(totalQty);
      }
    } catch (err) {
      console.log("Navbar cart fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.role === "shopper") {
      fetchCartCount();
    }
  }, [user]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-3">
      <nav className="max-w-7xl mx-auto bg-gradient-to-r from-orange-100/90 via-pink-50/90 to-purple-100/90 backdrop-blur-md rounded-full shadow-lg border border-white/60">
        <div className="px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
              <img src={"./favicon.ico"} alt="Logo" width={32} height={32} className="rounded-full" />
            </motion.div>
            <span className="text-lg font-bold hidden sm:inline bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Shopfinity
            </span>
          </div>

          {/* Desktop Links */}
          {user?.role === "shopper" && (
            <div className="hidden md:flex items-center gap-1">
              <NavItem label="Home" path="/" router={router} active={pathname === "/"} />
              <NavItem label="Categories" path="/category" router={router} active={pathname === "/category"} />
              <NavItem label="Shop" path="/shop" router={router} active={pathname === "/shop"} />
              <NavItem label="Orders" path="/orders" router={router} active={pathname === "/orders"} />
            </div>
          )}

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-5">
            {user?.role === "shopper" && (
              <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/category")} />
            )}

            <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />

            <div className="relative">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="user"
                  width={36}
                  height={36}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border-2 border-pink-500 p-0.5 cursor-pointer"
                  onClick={() => setOpenMenu(!openMenu)}
                />
              ) : (
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="w-9 h-9 rounded-full border-2 border-pink-500 flex items-center justify-center text-gray-700"
                >
                  <AiOutlineUser size={18} />
                </button>
              )}
              <AnimatePresence>
                {openMenu && <ProfileDropdown router={router} close={() => setOpenMenu(false)} />}
              </AnimatePresence>
            </div>

            {user?.role === "shopper" && <CartBtn router={router} count={cartCount} />}
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-4">
            {user?.role === "admin" || user?.role === "vendor" ? (
              <>
                <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />

                <div className="relative">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="user"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-pink-500 p-0.5 cursor-pointer"
                      onClick={() => setOpenMenu(!openMenu)}
                    />
                  ) : (
                    <button
                      onClick={() => setOpenMenu(!openMenu)}
                      className="w-8 h-8 rounded-full border-2 border-pink-500 flex items-center justify-center text-gray-700"
                    >
                      <AiOutlineUser size={16} />
                    </button>
                  )}
                  <AnimatePresence>
                    {openMenu && <ProfileDropdown router={router} close={() => setOpenMenu(false)} />}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/category")} />
                <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />
                <CartBtn router={router} count={cartCount} />
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-700"
                >
                  <AiOutlineMenu size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar close={() => setSidebarOpen(false)} router={router} user={user} />}
      </AnimatePresence>
    </div>
  );
}

/* ------- Components -------- */

const NavItem = ({ label, path, router, active }: any) => (
  <motion.button
    whileHover={{ y: -1 }}
    onClick={() => router.push(path)}
    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {label}
  </motion.button>
);

const IconBtn = ({ Icon, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="text-gray-600 hover:text-pink-600"
  >
    <Icon size={20} />
  </motion.button>
);

const CartBtn = ({ router, count }: any) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => router.push("/cart")}
    className="relative text-gray-600 hover:text-pink-600"
  >
    <AiOutlineShoppingCart size={20} />

    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-gradient-to-br from-pink-500 to-purple-600 text-white text-[10px] font-semibold rounded-full w-4.5 h-4.5 px-1 flex items-center justify-center">
        {count}
      </span>
    )}
  </motion.button>
);

const ProfileDropdown = ({ router, close }: any) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-2xl shadow-lg border border-white/60 bg-white/95 overflow-hidden"
  >
    <DropdownBtn Icon={AiOutlineUser} label="Profile" onClick={() => router.push("/profile")} close={close} />
    <DropdownBtn Icon={AiOutlineLogin} label="Sign In" onClick={() => router.push("/login")} close={close} />
    <DropdownBtn Icon={AiOutlineLogout} label="Sign Out" onClick={() => signOut({ callbackUrl: "/login" })} close={close} />
  </motion.div>
);

const DropdownBtn = ({ Icon, label, onClick, close }: any) => (
  <button
    onClick={() => {
      onClick();
      close();
    }}
    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 text-left"
  >
    <Icon size={16} /> {label}
  </button>
);

const Sidebar = ({ close, router }: any) => (
  <motion.div
    initial={{ x: "100%" }}
    animate={{ x: 0 }}
    exit={{ x: "100%" }}
    transition={{ type: "spring", stiffness: 200, damping: 24 }}
    className="fixed top-0 right-0 h-screen w-[70%] max-w-xs bg-white/90 backdrop-blur-xl p-6 text-gray-800 border-l border-white/60 shadow-2xl z-50"
  >
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
        Menu
      </h2>
      <button
        onClick={close}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <AiOutlineClose size={18} />
      </button>
    </div>

    <div className="flex flex-col gap-3">
      <SidebarLink Icon={AiOutlineHome} label="Home" path="/" router={router} close={close} />
      <SidebarLink Icon={AiOutlineAppstore} label="Categories" path="/category" router={router} close={close} />
      <SidebarLink Icon={AiOutlineShop} label="Shop" path="/shop" router={router} close={close} />
      <SidebarLink Icon={GoListUnordered} label="Orders" path="/orders" router={router} close={close} />

      <div className="h-px bg-gray-200 my-2" />

      <SidebarLink Icon={AiOutlineUser} label="Profile" path="/profile" router={router} close={close} />
      <SidebarLink Icon={AiOutlineLogin} label="Login" path="/login" router={router} close={close} />

      <SidebarSignOut Icon={AiOutlineLogout} label="Sign Out" close={close} />
    </div>
  </motion.div>
);

const SidebarLink = ({ Icon, label, path, router, close }: any) => (
  <button
    onClick={() => {
      router.push(path);
      close();
    }}
    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-orange-100 hover:to-purple-100 text-left text-sm font-medium transition-colors"
  >
    <Icon size={18} /> {label}
  </button>
);

const SidebarSignOut = ({ Icon, label, close }: any) => (
  <button
    onClick={() => {
      signOut();
      close();
    }}
    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-left text-sm font-semibold mt-2"
  >
    <Icon size={18} /> {label}
  </button>
);