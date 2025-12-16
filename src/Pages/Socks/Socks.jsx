import React, { useState } from 'react'
import './Socks.css'
import ApproachCard from '../../Components/ApproachCard/ApprochSection'
import socks from '../../APIs/socks.json'
import Quistions from '../../APIs/quistions.json'
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'

function Socks() {

  const [qsn, setQsn] = useState(false);

  const toggleQsn = (id) => {
    setQsn(prev => prev === id ? null : id);
  };

  return (
    <>
      <div className="socks-header">
        <div className='titles'>
          <h1 className='socks-title'>Anytime Socks</h1>
          <p className='socks-subtitle'>Made with a blend of light,
            breathable materials like tree fiber and Organic Cotton,
            our socks keep your feet cool, dry, and smiling
            (if feet could smile).</p>
        </div>
      </div>

      <div className="show-socks">
        <div className="headings">
          <h1 className='socks-h1'>No Show Socks</h1>
          <p className='socks-p'>Light, breathable and made to move and groove without budging.</p>
        </div>
        <div className="socks">
          {socks && socks.slice(0, 7).map((sock) => (
            <Link 
            className='socks-link'
            key={sock.id}
            to={`/items/socks/${sock.id}`}>
            <div className="sock" >
              <div className="sock-image">
                <img src={sock.image} alt={sock.color} className="sock-image" />
              </div>
              <div className="title-section">
                <h3 className="sock-titleshow">{sock.title}</h3>
                <p className='sock-color '>{sock.color}</p>
                <p className="sock-price" style={{ color: "red" }}>${sock.price} <del className='discount'>{sock.discount}</del></p>
              </div>
              <div className="quick-add">
                <p className='quick-add-p'>Quick Add</p>
                <div className="sizes">
                  <button>S<br /> <span>(W5–7)</span></button>
                  <button>M<br /> <span>(W8–10)</span></button>
                  <button>L<br /><span>(W11)</span></button>
                  <button>XL<br /><span>(M13–14)</span></button>
                </div>
              </div>
            </div>
            </Link>

          ))}
        </div>
      </div>

      {/* /////Awdsnkel-Socks//// */}

      <div className="show-socks">
        <div className="headings">
          <h1 className='socks-h1'>Ankle Socks</h1>
          <p className='socks-p'>Designed to keep you comfortable for workouts or work.</p>
        </div>
        <div className="socks">
          {socks && socks.slice(7, 12).map((sock) => (
            <Link
            className='socks-link'
            key={sock.id}
            to={`/items/socks/${sock.id}`}
            >
            <div className="sock" >
              <div className="sock-image">
                <img src={sock.image} alt={sock.color} className="sock-image" />
              </div>
              <div className="title-section">
                <h3 className="sock-titleshow">{sock.title}</h3>
                <p className='sock-color '>{sock.color}</p>
                <p className="sock-price ">{sock.price} <del className='discount'>{sock.discount}</del></p>
              </div>
              <div className="quick-add">
                <p className='quick-add-p'>Quick Add</p>
                <div className="sizes">
                  <button>S<br /> <span>(W5–7)</span></button>
                  <button>M<br /> <span>(W8–10)</span></button>
                  <button>L<br /><span>(W11)</span></button>
                  <button>XL<br /><span>(M13–14)</span></button>
                </div>
              </div>
            </div>
            </Link>

          ))}
        </div>
      </div>



      {/* /////Crew-Socks//// */}

      <div className="show-socks">
        <div className="headings">
          <h1 className='socks-h1'>Crew Socks</h1>
          <p className='socks-p'>A classic crew height sock designed to keep you comfortable whether it’s the <br />workweek or the weekend.</p>
        </div>
        <div className="socks">
          {socks && socks.slice(12, 23).map((sock) => (
            <Link
            className='socks-link'
            key={sock.id}
            to={`/items/socks/${sock.id}`}
            >
            <div className="sock" >
              <div className="sock-image">
                <img src={sock.image} alt={sock.color} className="sock-image" />
              </div>
              <div className="title-section">
                <h3 className="sock-titleshow">{sock.title}</h3>
                <p className='sock-color '>{sock.color}</p>
                <p className="sock-price ">{sock.price} <del className='discount'>{sock.discount}</del></p>
              </div>
              <div className="quick-add">
                <p className='quick-add-p'>Quick Add</p>
                <div className="sizes">
                  <button>S<br /> <span>(W5–7)</span></button>
                  <button>M<br /> <span>(W8–10)</span></button>
                  <button>L<br /><span>(W11)</span></button>
                  <button>XL<br /><span>(M13–14)</span></button>
                </div>
              </div>
            </div>
            </Link>

          ))}
        </div>
      </div>


      {/* /////Trino-Socks//// */}


      <div className="show-socks">
        <div className="headings">
          <h1 className='socks-h1'>3-Pack-Socks</h1>
          {/* <p className='socks-p'>Designed to keep you comfortable for workouts or work.</p> */}
        </div>
        <div className="socks-last">
          {socks && socks.slice(23, 30).map((sock) => (
            <Link
            className='socks-link'
            key={sock.id}
            to={`/items/socks/${sock.id}`}
            >
            <div className="sock">
              <div className="sock-image">
                <img src={sock.image} alt={sock.color} className="sock-image" />
              </div>
              <div className="title-section">
                <h3 className="sock-titleshow">{sock.title}</h3>
                <p className='sock-color '>{sock.color}</p>
                <p className="sock-price ">{sock.price} <del className='discount'>{sock.discount}</del></p>
              </div>
              <div className="quick-add">
                <p className='quick-add-p'>Quick Add</p>
                <div className="sizes">
                  <button>S<br /> <span>(W5–7)</span></button>
                  <button>M<br /> <span>(W8–10)</span></button>
                  <button>L<br /><span>(W11)</span></button>
                  <button>XL<br /><span>(M13–14)</span></button>
                </div>
              </div>
            </div>
            </Link>

          ))}
        </div>
      </div>


      <div className="intro">
        {
          Quistions.map((question) => (
            <div className="question" key={question.id}>
              <h1 className='question-title' onClick={() => toggleQsn(question.id)}>{question.quistion} <FiChevronDown className='size-6' /></h1>
              <AnimatePresence initial={false}>
                {
                  qsn === question.id && (
                    <motion.div
                      key='content'
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      // exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className='answer'>{question.answer}</p>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          ))
        }
      </div>

      <ApproachCard />
    </>
  )
}

export default Socks
