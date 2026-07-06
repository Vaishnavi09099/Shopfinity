import React from 'react'
import Slider from './Slider'
import CategorySlider from './CategorySlider'

const UserDashboard = () => {
  return (
  <>
    
     <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-orange-200 via-pink-100 to-purple-200 flex flex-col">
      <Slider />
      <CategorySlider />
    </div>
    
    </>
  )
}

export default UserDashboard