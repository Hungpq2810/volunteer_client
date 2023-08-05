import { Card, Collapse, Typography } from 'antd'
import React from 'react'
import { useQuery } from 'react-query'
import FaqApi from '../../../apis/faq.api'

const { Title } = Typography
const ListFaq = () => {
  const { data } = useQuery({
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
  const faqs = data?.data?.metadata?.faqs || []

  return (
    <div style={{ padding: '40px 0' }}>
      <Title level={2}>Câu hỏi thường gặp</Title>
      <Collapse
        items={faqs.map((faq) => ({
          key: faq.id,
          label: faq.question,
          children: <p>{faq.answer}</p>
        }))}
      />
    </div>
  )
}

export default ListFaq
