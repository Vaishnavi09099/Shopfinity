'use client'
import React from 'react'
import useGetMe from './hooks/useGetMe'


import useGetAllVendors from './hooks/useGetAllVendors'
import getAllProductsData from './hooks/useGetAllProducts'



function InitUser(){
    useGetMe()
    useGetAllVendors()
     getAllProductsData()
    return null

}
export default InitUser