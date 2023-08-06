import { Button, Input, Modal, Segmented, Space, Table, Tag, Typography, message } from 'antd'
import React, { useState } from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import EventApi from '../../apis/event.api'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title } = Typography
const { TextArea } = Input
const status = [
  {
    label: 'Đang yêu cầu',
    value: 'PENDING'
  },
  {
    label: 'Đã phê duyệt',
    value: 'APPROVED'
  },
  {
    label: 'Đã hủy',
    value: 'REJECT'
  }
]
const ManageEvent = () => {
  const [value, setValue] = useState(status[0].value)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [reason, setReason] = useState('')
  const showModal = (id) => {
    setIsModalOpen(true)
    setBookingId(id)
  }
  const handleOk = () => {
    handleCancelBooking()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setReason('')
    setBookingId(null)
  }
  const { data, isLoading } = useQuery({
    queryKey: ['my-events', value],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return EventApi.getMyEvent(value)
    },
    keepPreviousData: true,
    retry: 0
  })

  const { data: eventsJoined } = useQuery({
    queryKey: ['events-joined'],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return EventApi.eventJoined()
    },
    keepPreviousData: true,
    retry: 0
  })
  const queryClient = useQueryClient()

  const handleCancelBooking = () => {
    if (value === 'SUCCESS_PAYMENT') {
      return kickOutMutation.mutate(bookingId)
    }
    cancelBookingMutation.mutate(bookingId)
  }

  const cancelEventMutation = useMutation({
    mutationFn: (id) => EventApi.cancel(id),
    onSuccess: (_) => {
      message.success(`Hủy sự kiện thành công`)
      queryClient.invalidateQueries({ queryKey: ['my-events', value], exact: true })
    }
  })

  const columns = [
    {
      title: 'Tên',
      dataIndex: '',
      key: 'name',
      ellipsis: true,
      render: (data) => data.name
    },
    {
      title: 'Địa điểm',
      dataIndex: '',
      key: 'location',
      ellipsis: true,
      render: (data) => data.location
    },
    {
      title: 'Số người đã tham gia',
      dataIndex: '',
      key: 'volunteerse',
      ellipsis: true,
      render: (data) => data.volunteers
    },
    {
      title: 'Số lượng người tham gia tối đa',
      dataIndex: '',
      key: 'maxVolunteers',
      ellipsis: true,
      render: (data) => data.maxVolunteers
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: '',
      key: 'startDate',
      ellipsis: true,
      render: (data) => dayjs(data.startDate).format('DD-MM-YYYY')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: '',
      key: 'endDate',
      ellipsis: true,
      render: (data) => dayjs(data.endDate).format('DD-MM-YYYY')
    },

    {
      title: '',
      dataIndex: '',
      key: 'x',
      ellipsis: true,
      render: (data) => {
        return (
          <>
            <Space>
              {data.status !== 'REJECT' && (
                <Link to={`/update-event/${data.link}`}>
                  {' '}
                  <Button type='primary'>Sửa</Button>
                </Link>
              )}
              {data.status === 'APPROVED' && (
                <Button onClick={() => cancelEventMutation.mutate(data.id)} type='dashed'>
                  Hủy
                </Button>
              )}
            </Space>
          </>
        )
      }
    }
  ]

  const columns2 = [
    {
      title: 'Tên',
      dataIndex: '',
      key: 'name',
      ellipsis: true,
      render: (data) => data.event.name
    },
    {
      title: 'Địa điểm',
      dataIndex: '',
      key: 'location',
      ellipsis: true,
      render: (data) => data.event.location
    },
    {
      title: 'Số người đã tham gia',
      dataIndex: '',
      key: 'volunteerse',
      ellipsis: true,
      render: (data) => data.event.volunteers
    },
    {
      title: 'Số lượng người tham gia tối đa',
      dataIndex: '',
      key: 'maxVolunteers',
      ellipsis: true,
      render: (data) => data.event.maxVolunteers
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: '',
      key: 'startDate',
      ellipsis: true,
      render: (data) => dayjs(data.event.startDate).format('DD-MM-YYYY')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: '',
      key: 'endDate',
      ellipsis: true,
      render: (data) => dayjs(data.event.endDate).format('DD-MM-YYYY')
    },

    {
      title: '',
      dataIndex: '',
      key: 'x',
      ellipsis: true,
      render: (data) => {
        return (
          <>
            <Space>
              {new Date(data.event.endDate).getTime() < new Date().getTime() && (
                <Tag color='red-inverse'>Đã kết thúc</Tag>
              )}
            </Space>
          </>
        )
      }
    }
  ]
  const events = data?.data?.metadata?.events?.data || []
  const eventsJoin = eventsJoined?.data?.metadata?.events || []
  return (
    <>
      <Space style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Title level={3}>Quản lý sự kiện</Title>
        <Link to={'/create-event'}>
          <Button type='primary'>Tạo sự kiện</Button>
        </Link>
      </Space>
      <Space direction='vertical'>
        <Segmented options={status} value={value} onChange={setValue} />
        <Table loading={isLoading} columns={columns} dataSource={events} />
        <Title level={3}>Danh sách sự kiện đã tham gia</Title>
        <Table loading={isLoading} columns={columns2} dataSource={eventsJoin} />
      </Space>
      {/* <Modal
        title='Xác nhận'
        open={isModalOpen}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            loading={cancelBookingMutation.isLoading}
            disabled={cancelBookingMutation.isLoading}
            key='submit'
            type='primary'
            onClick={handleOk}
          >
            {'Xác nhận'}
          </Button>
        ]}
        onCancel={handleCancel}
      >
        <TextArea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder='Nhập lý do...' />
      </Modal> */}
    </>
  )
}

export default ManageEvent
