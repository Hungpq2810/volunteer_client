import { Alert, Button, Card, Col, Image, Row, Space, Table, Tag, Typography, message } from 'antd'
import React, { useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import EventApi from '../../apis/event.api'
import dayjs from 'dayjs'
import { AppContext } from '../../contexts/app.context'

const { Title } = Typography



const EventDetail = () => {
  const { profile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const { slug } = useParams()
  const { data } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => EventApi.getEvent(slug),
    enabled: slug !== undefined,
    staleTime: 1000 * 10
  })
  const event = data?.data?.metadata?.event || null
  const members = data?.data?.metadata?.members || []
  const joinEventMutation = useMutation({
    mutationFn: () => EventApi.join(event?.id),
    onSuccess: () => {
      message.success('Tham gia sự kiện thành công')
      queryClient.invalidateQueries({ queryKey: ['event', slug] })
    }
  })
  if (!event) {
    return <></>
  }

  return (
    <>
      <Title level={1}>{event.name}</Title>
      <Row gutter={32}>
        <Col className='image-main' span={16}>
          <Image style={{width: '100%'}} src={`http://localhost:3000/image/${event.image}`} />
        </Col>
        <Col span={8}>
          <Card>
            <Alert
              message=''
              description={
                <>
                  <p>
                    <b>Tác giả: </b>
                    {event.creator}
                  </p>
                  <p>
                    <b>Thể loại: </b>
                    <Tag color='green-inverse'>{event.category}</Tag>
                  </p>
                  <p>
                    <b>Địa điểm: </b>
                    {event.location}
                  </p>
                  <p>
                    <b>Số lượng người đã tham gia: </b>
                    {event.volunteers}
                  </p>
                  <p>
                    <b>Số lượng người tham gia tối đa: </b>
                    {event.maxVolunteers}
                  </p>
                  <p>
                    <b>Ngày bắt đầu: </b>
                    {dayjs(event.startDate).format('DD-MM-YYYY')}
                  </p>
                  <p>
                    <b>Ngày kết thúc: </b>
                    {dayjs(event.endDate).format('DD-MM-YYYY')}
                  </p>
                  {profile?.username !== event.creator &&
                    members.findIndex((item) => item.user.id === profile?.id) === -1 && (
                      <>
                      {!profile?.id && <Link to={'/login?url_back=du-lich-tinh-nguyen-ban-coi-phu-tho'} ><Button>Đăng ký</Button></Link> }
                      {profile?.id && <Button onClick={() => joinEventMutation.mutate()}>Đăng ký</Button> }
                      </>
                    )}
                </>
              }
              type='info'
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 50 }}>
        <Col span={24}>
          <Card>
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default EventDetail
