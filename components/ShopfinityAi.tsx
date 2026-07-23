"use client"
import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { X, Send, Loader, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
}

function ShopfinityAI() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Shopfinity AI 👋 Ask me about your orders, or find products across our vendors!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const res = await axios.post("/api/ai-assistant/chat", {
        message: userMessage
      })
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }])
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Something went wrong, please try again."
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating animated button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center"
      >
        {/* Pulsing glow ring - orange-pink-purple to match Shopfinity theme */}
        <motion.span
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-orange-50 to-purple-50 flex items-center justify-center overflow-hidden">
          {open ? (
            <X size={26} className="text-purple-700" />
          ) : (
            <Image
              src="/ai_bot_icon.png"   // 👈 apni image daal de public folder mein
              alt="Shopfinity AI"
              width={56}
              height={56}
              className="object-contain"
            />
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white px-4 py-3 flex items-center gap-2">
              <Sparkles size={18} />
              <h3 className="font-semibold">Shopfinity AI</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
                    <Loader size={16} className="animate-spin text-purple-600" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about your order or products..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 disabled:opacity-60 text-white flex items-center justify-center transition-opacity"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ShopfinityAI