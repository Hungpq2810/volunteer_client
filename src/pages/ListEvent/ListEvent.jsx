import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { useQuery } from 'react-query'
import EventApi from '../../apis/event.api'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import useQueryConfig from '../../hooks/useQueryConfig'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { BACKEND_URL } from '../../config/backend'

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day')
}
const ListEvent = () => {
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    const newData = omitBy(form.getFieldsValue(), isUndefined)
    navigate({
      pathname: '/events',
      search: createSearchParams({
        ...queryConfig,
        ...newData
      }).toString()
    })
  }

  const handleReset = () => {
    form.resetFields()
    navigate('/events')
  }

  const { data, isLoading } = useQuery({
    queryKey: ['events', queryConfig],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return EventApi.getEventsSearch(queryConfig)
    },
    keepPreviousData: true,
    retry: 0
  })
  const events = data?.data?.metadata?.events?.data || []
  return (
    <>
      <Typography.Title level={3}>Các chương trình</Typography.Title>
      <Row>
        <Col span={24}>
          <Card>
            <Form
              form={form}
              layout='vertical'
              name='basic'
              // style={{
              //   maxWidth: 800
              // }}
              initialValues={{
                remember: true
              }}
              onFinish={handleSubmit}
              autoComplete='off'
            >
              <Row style={{ width: '100%' }} gutter={16}>
                <Col span={12}>
                  <Form.Item label='Tên' name='name'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Thể loại' name='category'>
                    <Select
                      style={{
                        width: '100%'
                      }}
                      allowClear
                      
                      options={[
                        {
                          value: 'Education',
                          label: 'Education'
                        },
                        {
                          value: 'Volunteer',
                          label: 'Volunteer'
                        },
                        {
                          value: 'Subsidized',
                          label: 'Subsidized'
                        }
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Người tạo' name='creator'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label='Ngày bắt đầu' name='startDate'>
                    <DatePicker disabledDate={disabledDate} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label='Địa điểm' name='location'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Space>
                      <Button onClick={handleReset} type='default'>
                        Làm lại
                      </Button>
                      <Button type='primary' htmlType='submit'>
                        Tìm kiếm
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 50 }} gutter={16}>
        {events &&
          events.length > 0 &&
          events.map((event, index) => (
            <Col span={8} key={index}>
              <Link to={`/${event.link}`}>
                <Card
                  hoverable
                  cover={
                    <img
                      style={{ width: '100%', height: 300, objectFit: 'cover' }}
                      alt='example'
                      src={`${BACKEND_URL}/image/${event.image}`}
                    />
                  }
                >
                  <Card.Meta
                    title={event.name}
                    description={
                      <>
                        <p>Người đăng: {event.creator}</p>
                        <p>Địa điểm: {event.location}</p>
                        <p>
                          Thời gian: {dayjs(event.startDate).format('DD-MM-YYYY')} -{' '}
                          {dayjs(event.endDate).format('DD-MM-YYYY')}
                        </p>
                      </>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
      </Row>
    </>
  )
}

export default ListEvent
