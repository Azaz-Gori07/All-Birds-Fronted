import React from 'react'
import './NewArrivals.css'

function NewArrivals() {
  return (
    <>
    <div className="arrivals-header">
      <img src="https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_1920/cms/3JpUTVLHglPcAepDsBbAFS/e735a5ba62e71d40e97263b26ff63ec3/25Q2_HazyPine_Site_CustomCollection_Banner_Desktop_2880x710-TRGo.jpg" alt="" />
      <div className="arrivals-header-details">
        <div className="max-width">
          <h1>New Arrivals</h1>
        <p>The latest styles and limited edition colors that you can only find here (while they last, that is.)</p>
        </div>
      </div>
    </div>

    <div className="page-changer-links">
      <li className='li1'>Men's New Arrivals</li>
      <li className='li2'>Women's New Arrivals</li>
    </div>

    <div className="arrivals-men-products">
      <div className="arrivals-shoes">
        <div className="shoes-details">
          <h1>Shoes</h1>
          <p>Classic sneakers. Sporty running shoes. Comfy loafers. We got the wear-all day (with everything) shoes you and your closet need.</p>
      </div>
      </div>
    </div>
    </>
  )
}

export default NewArrivals
