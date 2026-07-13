"use client";

import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMe = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await axios.get("/api/user/currentUser");
        console.log("API /api/me response:", result.data);
        // The API returns { user, status } — prefer the inner user object when present
        const payload = result?.data?.user ?? result?.data ?? null;
        if (payload) {
          dispatch(setUserData(payload));
        } else {
      
        }
      } catch (err: any) {
  console.error("useGetMe error:", err.response?.status, err.response?.data || err.message);

}
    };

    getMe();
  }, [dispatch]);
};

export default useGetMe;

