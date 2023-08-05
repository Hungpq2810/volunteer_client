import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination';
import { Image } from 'antd'

const Banner = () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      height={350}
      pagination={{ clickable: true }}
      modules={[ Pagination,Autoplay]}
      centeredSlides={true}
    >
      <SwiperSlide
        style={{ height: '100%', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
      >
        <Image preview={false} src='https://veo.com.vn/wp-content/uploads/2023/07/WEB-SLIDER-2.jpg' />
      </SwiperSlide>
      <SwiperSlide
        style={{ height: '100%', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
      >
        <Image preview={false} src='https://veo.com.vn/wp-content/uploads/2023/07/2.jpg' />
      </SwiperSlide>
      <SwiperSlide
        style={{ height: '100%', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
      >
        <Image preview={false} src='https://veo.com.vn/wp-content/uploads/2023/07/3.jpg' />
      </SwiperSlide>
    </Swiper>
  )
}

export default Banner
