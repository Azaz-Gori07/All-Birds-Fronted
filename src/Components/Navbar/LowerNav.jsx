import React from 'react'
import './LowerNav.css'
import { Link } from 'react-router-dom'

function LowerNav () {
  return (
    <div className='LowerNav'>
      <ul>
        <Link to="/men"><li>Men's Shoes</li></Link>
        <Link to="/women"><li>Women's Shoes</li></Link>
        <Link to='/new-arrivals'><li>New Arrivals</li></Link>
      </ul>
    </div>
  )
}

export default LowerNav
