import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Table, Typography, Upload, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import AuthApi from '../../apis/auth.api'
import Auth from '../../utils/auth'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import EventApi from '../../apis/event.api'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const dateFormat = 'YYYY-MM-DD'

const { RangePicker } = DatePicker

const { Title } = Typography

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

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
  // {
  //   title: 'STT',
  //   dataIndex: '',
  //   key: 'stt',
  //   render: (_, index) => <span>{index}</span>
  // },
  {
    title: 'Họ và tên',
    dataIndex: '',
    key: 'name',
    render: (data) => <span>{data?.user.name}</span>
  },
  {
    title: 'Tên đăng nhập',
    dataIndex: '',
    key: 'username',
    render: (data) => <span>{data?.user.username}</span>
  },
  {
    title: 'Email',
    dataIndex: '',
    key: 'email',
    render: (data) => <span>{data?.user.email}</span>
  }
]

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day')
}

const CreateEvent = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { slug } = useParams()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()
  const [eventId, setEventId] = useState(null)

  const createEventMutation = useMutation({
    mutationFn: (body) => EventApi.createEvent({ ...body, startDate: body.date[0], endDate: body.date[1] }),
    onSuccess: (data) => {
      message.success('Tạo sự kiện thành công!')
      navigate('/my-event')
    }
  })
  const updateEventMutation = useMutation({
    mutationFn: (_) => EventApi.updateEvent(eventId, form.getFieldsValue()),
    onSuccess: (data) => {
      message.success('Cập nhật sự kiện thành công')
      form.resetFields()
      navigate('/my-event')
    }
  })

  const { data } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => EventApi.getEvent(slug),
    enabled: slug !== undefined,
    staleTime: 1000 * 10
  })

  const members = data?.data?.metadata?.members || []
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data.data?.metadata?.event,
        date: [
          dayjs(data?.data?.metadata?.event.startDate, dateFormat),
          dayjs(data?.data?.metadata?.event.endDate, dateFormat)
        ]
      })
      setEventId(data?.data?.metadata?.event.id)
    }
  }, [data])

  const onFinish = (body) => {
    if (slug) {
      return updateEventMutation.mutate()
    }
    createEventMutation.mutate(body)
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
      console.log(info.file.response.metadata.url)
      form.setFieldValue('image', info.file.response.metadata.url)
    }
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  )

  const image = data?.data?.metadata?.event.image

  return (
    <>
      <Title level={2}>{slug ? 'Cập nhật sự kiện' : 'Tạo sự kiện'}</Title>
      <Divider />
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
          label='Tên sự kiện'
          name='name'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Ảnh'
          name='image'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Upload
            name='image'
            listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            action='http://localhost:3000/upload/image'
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl || image ? (
              <img
                src={imageUrl ? imageUrl : `http://localhost:3000/image/${image}`}
                alt='avatar'
                style={{
                  width: '100%'
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label='Nội dung chi tiết'
          name='description'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <ReactQuill modules={modules} formats={formats} style={{ height: 400, marginBottom: 30 }} theme='snow' />
        </Form.Item>
        <Form.Item
          label='Thể loại'
          name='category'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Select
            style={{
              width: 120
            }}
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
        <Form.Item
          label='Đại điểm'
          name='location'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Thành viên tham gia tối đa'
          name='maxVolunteers'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <InputNumber min={1} max={100} />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
          name='date'
          label='Thời gian diễn ra sự kiện'
        >
          <RangePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={createEventMutation.isLoading}
            disabled={createEventMutation.isLoading}
            type='primary'
            htmlType='submit'
          >
            {slug ? 'Cập nhật' : 'Tạo'}
          </Button>
        </Form.Item>
      </Form>
      {
        slug && <Row>
        <Col span={24}>
          <Title level={3}>Danh sách thành viên đã tham gia</Title>
          <Table columns={columns} dataSource={members} />
        </Col>
      </Row>
      }
    </>
  )
}

export default CreateEvent
