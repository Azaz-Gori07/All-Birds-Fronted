import React, { useState } from 'react'
import './TopGreen.css'
import {Link} from 'react-router-dom'
import {FaChevronRight} from 'react-icons/fa'


function TopGreen() {

  const [top , setTop] = useState(true)

  const toggel = ()=> setTop (prev => !prev)


  return (
    <div className='topgreen'>
      {top ? (
  <p className='top1'>
    New Utility Collection: Explore-Ready Features On Your Fave Sneakes
    <b> Shop Men</b> I <b> Shop Women</b>
  </p>
) : (
  <p className='top2'>
    Free Shipping On Orders Over $75. Easy Returns
  </p>
)}

      
      <FaChevronRight className='chevronRight' onClick={toggel}/>
    </div>
  )
}

export default TopGreen
