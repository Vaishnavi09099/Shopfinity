'use client'
import React from 'react'
import useGetMe from './hooks/useGetMe'


import useGetAllVendors from './hooks/useGetAllVendors'



function InitUser(){
    useGetMe()
    useGetAllVendors()
    return null

}
export default InitUser