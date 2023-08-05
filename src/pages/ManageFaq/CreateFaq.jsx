import React, { useEffect } from 'react'
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import FaqApi from '../../apis/faq.api'
import dayjs from 'dayjs'

const dateFormat = 'YYYY-MM-DD'

const CreateFaq = ({ isModalOpen, setIsModalOpen, faqId = null, setFaqId }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const handleOk = async () => {
    await form.validateFields()
    handleCreateFaq()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setFaqId(null)
    form.resetFields()
  }
  const addFaqMutation = useMutation({
    mutationFn: (body) => FaqApi.createFaq(body),
    onSuccess: () => {
      message.success('Tạo faq thành công')
      form.resetFields()
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['faqs'], exact: true })
    }
  })

  const handleCreateFaq = () => {
    console.log('100 đ', form.getFieldsValue())
    if (faqId) {
      updateFaqMutation.mutateAsync()
    } else {
      addFaqMutation.mutateAsync(form.getFieldsValue())
    }
  }

  const { data } = useQuery({
    queryKey: ['faq', faqId],
    queryFn: () => FaqApi.getFaq(faqId),
    enabled: faqId !== null,
    staleTime: 1000 * 10
  })
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data.data?.metadata?.faq
      })
    }
  }, [data])

  const updateFaqMutation = useMutation({
    mutationFn: (_) => FaqApi.updateFaq(faqId, form.getFieldsValue()),
    onSuccess: (data) => {
      queryClient.setQueryData(['faq', faqId], data.data.metadata.faq)
      message.success('Cập nhật faq thành công')
      form.resetFields()
      setIsModalOpen(false)
      setFaqId(null)
      queryClient.invalidateQueries({ queryKey: ['faqs'], exact: true })
    }
  })
  return (
    <>
      <Modal
        footer={[
          <Button key='back' onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            loading={addFaqMutation.isLoading || updateFaqMutation.isLoading}
            disabled={addFaqMutation.isLoading || updateFaqMutation.isLoading}
            key='submit'
            type='primary'
            onClick={handleOk}
          >
            {faqId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        ]}
        width={800}
        title={faqId ? 'Cập nhật faq' : 'Tạo mới faq'}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout='vertical'
          name='basic'
          style={{
            maxWidth: 800
          }}
          initialValues={{
            remember: true
          }}
          // onFinish={onFinish}
          autoComplete='off'
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label='Câu hỏi'
                name='question'
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!'
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='Câu trả lời'
                name='answer'
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!'
                  }
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default CreateFaq
