import { Button, Divider, Form, Space, Table, Typography, message } from 'antd'
import React, { useEffect } from 'react'
import { useMutation, useQuery } from 'react-query'
import FeedbackApi from '../../apis/feedback.api'
import dayjs from 'dayjs'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import GenApi from '../../apis/gen.api'

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean']
  ]
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image'
]

const columns = [
  {
    title: 'Email',
    dataIndex: '',
    key: 'email',
    ellipsis: true,
    render: (data) => data.email
  },
  {
    title: 'Nội dung',
    dataIndex: '',
    key: 'content',
    ellipsis: true,
    render: (data) => data.content
  },
  {
    title: 'Ngày gửi',
    dataIndex: '',
    key: 'date',
    ellipsis: true,
    render: (data) => dayjs(data.createdAt).format('DD-MM-YYYY')
  }
]
const General = () => {
  const saveMutation = useMutation({
    mutationFn: (body) => GenApi.saveGen({ k: 'term', v: body.term }),
    onSuccess: (data) => {
      message.success('Lưu thành công!')
    }
  })
  const [form] = Form.useForm()
  const { data, isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return FeedbackApi.getAllFeedback()
    },
    keepPreviousData: true,
    retry: 0
  })

  const { data: term } = useQuery({
    queryKey: ['term'],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return GenApi.getGen('term')
    },
    keepPreviousData: true,
    retry: 0
  })

  console.log(term)

  const onFinish = (body) => {
    saveMutation.mutate(body)
  }

  const feedback = data?.data?.metadata?.feedback.data || []
  const termValue = term?.data?.metadata?.gen.v || null

  useEffect(() => {
    if (termValue) {
      form.setFieldValue('term', termValue)
    }
  }, [termValue])

  return (
    <Space direction='vertical'>
      <Typography.Title level={3}>Điều khoản và quy định</Typography.Title>
      <Form
        form={form}
        layout='vertical'
        name='basic'
        style={{
          maxWidth: 900,
          margin: '0 auto'
        }}
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          // label='Nội dung chi tiết'
          name='term'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <ReactQuill modules={modules} formats={formats} style={{ height: 400, marginBottom: 30 }} theme='snow' />
        </Form.Item>
        <Form.Item>
          <Button loading={saveMutation.isLoading} disabled={saveMutation.isLoading} type='primary' htmlType='submit'>
            Lưu
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <Typography.Title level={3}>Danh sách phản hồi</Typography.Title>
      <Table loading={isLoading} columns={columns} dataSource={feedback} />
    </Space>
  )
}

export default General
