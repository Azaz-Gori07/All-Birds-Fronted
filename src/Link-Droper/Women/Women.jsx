import React from 'react'
import './Women.css'

function Women({drop}) {
  return (
    <>
    <div className={`main-dropper ${drop ? 'drop' : 'hide'}`}>
      <div className='main-1'>
      <div className="links">
        <h1>SHOES</h1>

        <ul>
          <li>Sneakers</li>
          <li>Slip Ons</li>
          <li>High Tops</li>
          <li>Sandals</li>
          <li>All-Weather</li>
          <li>Sale</li>
          <li>Shop All</li>
        </ul>
      </div>
      <div className="links">
        <h1>BESTSELLERS</h1>

        <ul>
          <li>Tree Runner Go</li>
          <li>Tree Dasher 2</li>
          <li>Canvas Piper</li>
          <li>Tree Runner</li>
          <li>Tree Glider</li>
          <li>Tree Dasher Relay</li>
          <li>Wool Runner Go</li>
          <li>Shop All</li>
        </ul>
      </div>
      <div className="links">
        <h1>APPAREL & MORE</h1>

        <ul>
          <li>Socks</li>
          <li>Tees</li>
          <li>Sweats</li>
          <li>Bags</li>
          <li>Hats</li>
          <li>Insoles</li>
          <li>Gift Cards</li>
        </ul>
      </div>
      <div className="featureCom">
        <h1>FEATURED</h1>

        <div className="mens-Arrivals">
          <div className="arrivals-1">
            <img src="Mens_New_Arrivals_25Q2_UtilityCollection_Site_NavTile_Mens_Desktop_1125x324.avif" alt="" />
            <p>MEN'S NEW ARRIVALS</p>
          </div>
          <div className="arrivals-1">
            <img src="25Q2_White_Sneakers_Season_Site_NavTile_Mens_Desktop_1125x324.avif" alt="" />
            <p>TRENDING: WHITE SNEAKS</p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Women
