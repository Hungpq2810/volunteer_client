import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { Card, Typography } from 'antd'
import { useQuery } from 'react-query'
import EventApi from '../../../apis/event.api'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const { Meta } = Card
const { Title } = Typography
const EventComing = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['events', 'coming'],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return EventApi.getEventsComing()
    },
    keepPreviousData: true,
    retry: 0
  })
  const events = data?.data?.metadata?.events?.data || []
  return (
    <div style={{ padding: '80px 0' }}>
      <Title level={2}>Các sự kiện sắp diễn ra</Title>
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        height={360}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        // centeredSlides={true}
      >
        {events &&
          events.length > 0 &&
          events.map((event, index) => (
            <SwiperSlide key={event.id}>
              <Link to={`/${event.link}`}>
                <Card hoverable cover={<img style={{ width: '100%', height: 300, objectFit: 'cover'}} alt='example' src={`http://localhost:3000/image/${event.image}`} />}>
                  <Meta
                    title={event.name}
                    description={<>
                    <p>Người đăng: {event.creator}</p>
                    <p>Địa điểm: {event.location}</p>
                    <p>Thời gian: {dayjs(event.startDate).format('DD-MM-YYYY')} - {dayjs(event.endDate).format(
                      'DD-MM-YYYY'
                    )}</p>
                    </>}
                  />
                </Card>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  )
}

export default EventComing
