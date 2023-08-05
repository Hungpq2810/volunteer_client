import React, { useState } from 'react'
import { Button, Divider, Space, Typography } from 'antd'
import ListFaq from './ListFaq'
import { PlusOutlined } from '@ant-design/icons'
import CreateFaq from './CreateFaq'

const { Title } = Typography

const ManageFaq = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [faqId, setFaqId] = useState(null)
  return (
    <>
      <Title level={3}>Danh sách faq</Title>
      <Space style={{ float: 'right', marginBottom: 20 }}>
        <Button onClick={() => setIsModalOpen(true)} type='primary' icon={<PlusOutlined />}>
          Tạo mới
        </Button>
      </Space>
      <Divider />
      <ListFaq setFaqId={setFaqId} setIsModalOpen={setIsModalOpen} />
      <CreateFaq setFaqId={setFaqId} faqId={faqId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  )
}

export default ManageFaq
