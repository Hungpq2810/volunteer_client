import { Button, Card, Col, Form, Image, Input, Row, Typography, message } from 'antd'
import React from 'react'
import { useMutation } from 'react-query'
import FeedbackApi from '../../../apis/feedback.api'

const SendFeedBack = () => {
  const [form] = Form.useForm()
  const sendFeedbackMutation = useMutation({
    mutationFn: (body) => FeedbackApi.createFeedback(body)
  })

  const onFinish = (body) => {
    sendFeedbackMutation.mutate(body, {
      onSuccess: (data) => {
        form.resetFields()
        message.success('Gửi phản hồi thành công!')
      }
    })
  }
  return (
    <Card style={{ padding: '40px 0' }}>
      <Typography.Title level={2}>Gửi Feedback cho chúng tôi</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Image
            width={270}
            src='https://veo.com.vn/wp-content/uploads/2023/01/Intersect-470x470.png'
            preview={false}
          />
        </Col>
        <Col span={16}>
          <Form
            form={form}
            layout='vertical'
            name='0375'
            style={{
              maxWidth: 600
            }}
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
            autoComplete='off'
          >
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Khhông đúng định dạng!',
                  type: 'email'
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Nội dung'
              name='content'
              rules={[
                {
                  required: true,
                  message: 'Khhông được bỏ trống!'
                }
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button block type='primary' htmlType='submit'>
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

export default SendFeedBack
