'use client'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllVendorData } from '@/redux/vendorSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function useGetAllVendors() {
  const dispatch = useDispatch<AppDispatch>()
  const { userData } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const fetchAllVendor = async () => {
      try {
        const result = await axios.get("/api/vendor/AllVendor")
          console.log("allVendorData:", result)
        dispatch(setAllVendorData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setAllVendorData([]))
      }
    }
    fetchAllVendor()
  }, [userData, dispatch])
}

export default useGetAllVendors