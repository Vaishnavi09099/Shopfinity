"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { Sparkles, MessageCircle, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "motion/react";

interface ChatUser {
  _id: string;
  name: string;
  image?: string;
  role: "user" | "vendor" | "admin";
  shopName?: string;
}

interface Message {
  sender: string;
  text: string;
  createdAt: string;
}

export default function SupportPage() {
  const { userData } = useSelector((state: RootState) => state.user);
  const myId = userData?._id ? String(userData._id) : "";

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ================= ACTIVE USERS ================= */
  useEffect(() => {
    if (!myId) return;
    axios
      .get("/api/support/active-users")
      .then((res) => setUsers(res.data || []))
      .catch(console.log);
  }, [myId]);

  /* ================= FETCH MESSAGES ================= */
  useEffect(() => {
    if (!activeUser) return;

    axios
      .post("/api/support/get", { withUserId: activeUser._id })
      .then((res) => setMessages(res.data || []))
      .catch(console.log);
  }, [activeUser]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= POLLING FOR NEW MESSAGES (cross-user sync) ================= */
  useEffect(() => {
    if (!activeUser) return;

    const interval = setInterval(() => {
      axios
        .post("/api/support/get", { withUserId: activeUser._id })
        .then((res) => setMessages(res.data || []))
        .catch(console.log);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeUser]);

  /* ================= FETCH AI SUGGESTIONS (BUTTON) ================= */
  const fetchSuggestions = async () => {
    if (!messages.length || !activeUser || !userData?.role) return;

    const lastMessage = messages[messages.length - 1];
    if (String(lastMessage.sender) === String(myId)) return;

    setLoadingSuggestions(true);

    try {
      const res = await axios.post("/api/support/aiSuggestions", {
        message: lastMessage.text,
        role: userData.role,
        targetRole: activeUser.role,
      });

      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.log("AI Suggestion error:", err);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim() || !activeUser) return;

    await axios.post("/api/support/send", {
      receiverId: activeUser._id,
      text,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: myId,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);

    setText("");
    setSuggestions([]);
  };

  const formatTime = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!myId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading support...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 p-3 sm:p-6 pt-24">
      {/* Blobs */}
      <div className="absolute w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 top-1/3 -right-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          Support
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[80vh]">
          {/* ================= LEFT PANEL ================= */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-4 flex flex-col shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-gray-900 leading-tight">Conversations</h2>
                <p className="text-[11px] text-gray-400">{users.length} active chats</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2 mb-4 flex-shrink-0">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-transparent text-xs outline-none placeholder-gray-400"
              />
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1">
              {filteredUsers.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-10">No active chats</p>
              ) : (
                filteredUsers.map((u) => {
                  const isActive = activeUser?._id === u._id;
                  return (
                    <div
                      key={String(u._id)}
                      onClick={() => setActiveUser(u)}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 shadow-md scale-[1.01]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        {u.image ? (
                          <Image src={u.image} alt={u.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FaUserCircle className="text-gray-400 w-7 h-7" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-gray-900"}`}>
                          {u.name}
                        </p>
                        <p className={`text-[11px] truncate ${isActive ? "text-white/80" : "text-gray-400"}`}>
                          {u.role === "admin" ? "Admin Support" : u.shopName || u.role}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl flex flex-col overflow-hidden shadow-lg">
            {!activeUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">No conversation selected</p>
                  <p className="text-xs text-gray-400 mt-1">Pick someone from the left to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* ================= CHAT HEADER ================= */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white/50 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    {activeUser.image ? (
                      <Image src={activeUser.image} alt={activeUser.name} width={40} height={40} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FaUserCircle className="text-gray-400 w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{activeUser.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {activeUser.role === "admin" ? "Admin Support" : activeUser.shopName || activeUser.role}
                    </p>
                  </div>
                </div>

                {/* ================= MESSAGES ================= */}
                <div className="flex-1 p-4 sm:p-5 space-y-3 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <MessageCircle className="w-10 h-10" />
                      <p className="text-xs text-gray-400">No messages yet — say hi 👋</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.sender === myId;
                      const avatarUser = isMe ? userData : activeUser;

                      return (
                        <div key={i} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                          {!isMe && (
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                              {avatarUser?.image ? (
                                <Image src={avatarUser.image} alt="user" width={28} height={28} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <FaUserCircle className="text-gray-400 w-5 h-5" />
                                </div>
                              )}
                            </div>
                          )}

                          <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                            <div
                              className={`px-4 py-2.5 text-sm ${
                                isMe
                                  ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-2xl rounded-br-md"
                                  : "bg-gray-100 text-gray-700 rounded-2xl rounded-bl-md"
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-300 mt-1 px-1">{formatTime(msg.createdAt)}</span>
                          </div>

                          {isMe && (
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                              {userData?.image ? (
                                <Image src={userData.image} alt="me" width={28} height={28} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <FaUserCircle className="text-gray-400 w-5 h-5" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* ================= AI BUTTON ================= */}
                <div className="px-4 sm:px-5 pb-2 flex-shrink-0">
                  <button
                    onClick={fetchSuggestions}
                    disabled={loadingSuggestions}
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-100 hover:border-purple-200 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {loadingSuggestions ? "Generating..." : "Get AI Suggestions"}
                  </button>
                </div>

                {/* ================= AI SUGGESTIONS ================= */}
                {suggestions.length > 0 && (
                  <div className="px-4 sm:px-5 pb-3 flex gap-2 flex-wrap flex-shrink-0">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setText(s)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* ================= INPUT ================= */}
                <div className="p-3 sm:p-4 border-t border-gray-100 flex gap-2 flex-shrink-0 bg-white/50">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm outline-none focus:border-pink-400 transition-colors"
                  />
                  <motion.button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity shadow-md"
                  >
                    <FaPaperPlane className="text-white text-sm" />
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}