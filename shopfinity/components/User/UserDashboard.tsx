import React from 'react'
import Slider from './Slider'
import CategorySlider from './CategorySlider'
import ProductCardPage from './ProductCardPage'

const UserDashboard = () => {
  return (
  <>
    
     <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-orange-200 via-pink-100 to-purple-200 flex flex-col">
      <Slider />
      <CategorySlider />
      <ProductCardPage />
 
    </div>
    
    </>
  )
}

export default UserDashboard