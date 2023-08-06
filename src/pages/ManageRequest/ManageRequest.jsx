import { Button, Input, Modal, Popconfirm, Segmented, Space, Table, Tag, Typography, message } from 'antd'
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
const ManageRequest = () => {
  const [value, setValue] = useState(status[0].value)
  const { data, isLoading } = useQuery({
    queryKey: ['events', value],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return EventApi.getEvents(value)
    },
    keepPreviousData: true,
    retry: 0
  })
  const queryClient = useQueryClient()
  const cancelEventMutation = useMutation({
    mutationFn: (id) => EventApi.reject(id),
    onSuccess: (_) => {
      message.success(`Hủy yêu cầu thành công`)
      queryClient.invalidateQueries({ queryKey: ['events', value], exact: true })
    }
  })
  const acceptEventMutation = useMutation({
    mutationFn: (id) => EventApi.approve(id),
    onSuccess: (_) => {
      message.success(`Xác nhận yêu cầu thành công`)
      queryClient.invalidateQueries({ queryKey: ['events', value], exact: true })
    }
  })

  const handleAcceptEvent = (id) => {
    acceptEventMutation.mutate(id)
  }
  const handleRejectEvent = (id) => {
    cancelEventMutation.mutate(id)
  }

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
    // {
    //   title: 'Số người đã tham gia',
    //   dataIndex: '',
    //   key: 'volunteerse',
    //   ellipsis: true,
    //   render: (data) => data.volunteers
    // },
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
      key: 'operation',
      fixed: 'right',
      render: (data) => {
        return (
          <>
            <Space>
              {data.status === 'PENDING' && (
                <>
                  <Button onClick={() => handleAcceptEvent(data.id)} type='primary'>
                    Xác nhận
                  </Button>
                  <Popconfirm
                    title='Hủy yêu cầu'
                    description='Bạn có chắc hủy yêu cầu này không?'
                    onConfirm={() => handleRejectEvent(data.id)}
                    okText='Đồng ý'
                    cancelText='Hủy'
                  >
                    <Button >Hủy</Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </>
        )
      }
    }
  ]
  const events = data?.data?.metadata?.events?.data || []
  return (
    <>
      <Space style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Title level={3}>Quản lý yêu cầu</Title>
      </Space>
      <Space direction='vertical'>
        <Segmented options={status} value={value} onChange={setValue} />
        <Table
          // scroll={{
          //   x: 1100
          // }}
          loading={isLoading}
          columns={columns}
          dataSource={events}
        />
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

export default ManageRequest
