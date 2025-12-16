import React from 'react'
import './Help.css'
import ApproachCard from '../../Components/ApproachCard/ApprochSection'

function Help() {
  return (
    <>
      <div class="bg-[#1d1d1d] text-white py-20 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">How Can We Help?</h1>
        <p class="text-[16px] mb-1 cursor-pointer">Chat with us</p>
        <p class="text-[16px] mb-1">Send us a text: 1-814-251-9966</p>
        <p class="text-[16px] mb-1">Give us a call: 1-888-963-8944</p>
        <p class="text-[16px] mb-1">Monday - Wednesday: 5AM - 5PM PST</p>
        <p class="text-[16px]">Thursday: 5AM - 3PM PST</p>
      </div>

      <section class="faq-section">
        <div className="faq-subtitle-div">
          <p class="faq-subtitle">What can we help you with?</p>
        </div>
        <div className="faq-title-div">
          <h2 class="faq-title">Frequently Asked Questions</h2>
        </div>

        <div class="faq-columns">
          <div class="faq-column">
            <h3 class="faq-heading">Products & Fit</h3>
            <ul>
              <li>Do Allbirds run true to size?</li>
              <li>Will my shoes stretch?</li>
              <li>Are Allbirds good for flat feet?</li>
              <li>Are Allbirds waterproof?</li>
              <li>Can you wash Allbirds insoles?</li>
              <li>Are Allbirds washable?</li>
            </ul>
          </div>

          <div class="faq-column">
            <h3 class="faq-heading">Returns & Exchanges</h3>
            <ul>
              <li>Can I return or exchange an in store purchase online?</li>
              <li>How do I make a gift exchange?</li>
              <li>What is Allbirds' return policy?</li>
            </ul>
          </div>

          <div class="faq-column">
            <h3 class="faq-heading">Orders, Shipping & Tracking</h3>
            <ul>
              <li>Do you offer gift wrapping?</li>
              <li>Can I expedite my order?</li>
              <li>How do you ship?</li>
              <li>What if I want to cancel or change my order?</li>
            </ul>
          </div>

          <div class="faq-column">
            <h3 class="faq-heading">Payments & Refunds</h3>
            <ul>
              <li>When can I expect my refund?</li>
              <li>Does Allbirds offer discount codes or coupons?</li>
              <li>How do I send a gift card?</li>
            </ul>
          </div>

          <div class="faq-column">
            <h3 class="faq-heading">Company</h3>
            <ul>
              <li>What is your commitment to sustainability?</li>
              <li>Where are Allbirds products made?</li>
              <li>How do you ensure fair and safe working conditions at factories?</li>
            </ul>
          </div>
        </div>

        <div class="see-more">See more results</div>
      </section>

<ApproachCard/>

    </>

  )
}

export default Help
