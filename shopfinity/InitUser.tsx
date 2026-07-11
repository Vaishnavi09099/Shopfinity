'use client'
import React from 'react'
import useGetMe from './hooks/useGetMe'


import useGetAllVendors from './hooks/useGetAllVendors'
import getAllProductsData from './hooks/useGetAllProducts'
import getAllOrdersData from './hooks/useGetAllOrdersData'



function InitUser(){
    useGetMe()
    useGetAllVendors()
     getAllProductsData()
     getAllOrdersData()
    return null

}
export default InitUser