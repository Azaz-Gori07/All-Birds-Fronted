import React from 'react'
import './Reburn.css'
import ApproachCard from '../../Components/ApproachCard/ApprochSection'

function Reburn() {
  return (
    <>

    <div className='rerun-main'>
      <div className="rerun-image">
        <img src="https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_1200/cms/6qdYyIqg2U8ZQHKb6Oqyq4/af5847017a1b1644314547278c58327e/24Q2_EarthDay_ReRun_Site_Thumbnail_1200x1684.jpg" alt="" />
      </div>



      <section class="rerun-section">
    <h1 class="title">Allbirds ReRun™</h1>
    <h2 class="subtitle">A New Way To Get Old Favorites</h2>
    
    <p class="description">
      Allbirds ReRun™ is a marketplace where you can shop slightly imperfect and gently used products, extending their life and lowering our impact on the planet.
      Allbirds has partnered with Trove, a company that specializes in circular commerce, to run Allbirds ReRun™ on our behalf.
    </p>

    <p class="notice">
      <strong>By clicking the link below, you will be leaving allbirds.com and heading to the ReRun marketplace site.</strong>
    </p>

    <button class="rerun-button">Start Shopping ReRun™</button>
  </section>
    </div>

    <ApproachCard/>
    </>
    
  )
}

export default Reburn
