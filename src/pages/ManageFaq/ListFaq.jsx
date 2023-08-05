import React, { useState } from 'react'
import { Button, Popconfirm, Space, Table, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import FaqApi from '../../apis/faq.api'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const ListFaq = ({ setIsModalOpen, setFaqId }) => {
  const [sortedInfo, setSortedInfo] = useState({})
  const queryClient = useQueryClient()
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter)
  }
  const { data, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return FaqApi.getAllFaq()
    },
    keepPreviousData: true,
    retry: 0
  })

  const handleOpenUpdateFaqModal = (id) => {
    setFaqId(id)
    setIsModalOpen(true)
  }

  const deleteFaqMutation = useMutation({
    mutationFn: (id) => FaqApi.deleteFaq(id),
    onSuccess: (_) => {
      message.success(`Xóa thành công faq`)
      queryClient.invalidateQueries({ queryKey: ['faqs'], exact: true })
    }
  })

  const handleDelete = (id) => {
    deleteFaqMutation.mutate(id)
  }

  const faqs = data?.data?.metadata?.faqs || []
  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'question',
      key: 'q',
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'answer',
      key: 'a',
      // sorter: (a, b) => a.email - b.email,
      // sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      ellipsis: true,
      fixed: 'right',
      render: (data) => {
        return (
          <>
            <Button
              onClick={() => handleOpenUpdateFaqModal(data.id)}
              style={{ color: '#ff9a3f' }}
              icon={<EditOutlined />}
              type='ghost'
              shape='circle'
            ></Button>
            <Popconfirm
              title='Xóa faq'
              description='Bạn có chắc xóa faq này không?'
              onConfirm={() => handleDelete(data.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <Button style={{ color: 'red' }} icon={<DeleteOutlined />} type='ghost' shape='circle'></Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]
  return (
    <>
      <Table loading={isLoading} columns={columns} dataSource={faqs} onChange={handleChange} />
    </>
  )
}

export default ListFaq
