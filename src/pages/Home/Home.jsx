import React, { useContext, useEffect } from 'react'
import Banner from './Banner/Banner'
import EventComing from './EventComing/EventComing'
import SendFeedBack from './SendFeedBack/SendFeedBack'
// Import Swiper React components

const Home = () => {
  return (
    <>
      <Banner />
      <EventComing />
      <SendFeedBack />
    </>
  )
}

export default Home
