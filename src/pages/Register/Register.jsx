import React, { useContext } from 'react'
import { Typography, Button, Form, Input, Divider, DatePicker } from 'antd'
import { useMutation } from 'react-query'
import AuthApi from '../../apis/auth.api'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'

const { Title, Text } = Typography

const Register = () => {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const { setIsAuthenticated, setProfile, setPermissions } = useContext(AppContext)
  const registerAccountMutation = useMutation({
    mutationFn: (body) => AuthApi.registerAccount(body)
  })
  const onFinish = (body) => {
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data?.metadata?.user)
        // setPermissions(data.data?.metadata?.permissions)
        navigate(`${search.get('url_back') ? `/${search.get('url_back')}` : '/'}`)
      }
    })
  }
  return (
    <>
      <Title level={3}>Đăng ký</Title>
      <Divider />
      <Form
        layout='vertical'
        name='basic'
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
          label='Họ và tên'
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
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: 'Không đúng định dạng!',
              type: 'email'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Tên đăng nhập'
          name='username'
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
          label='Mật khẩu'
          name='password'
          rules={[
            {
              required: true,
              message: 'Bắt buộc có 8 ký tự, ít nhất 1 chữ hoặc 1 số!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='Số điện thoại'
          name='phoneNumber'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            loading={registerAccountMutation.isLoading}
            disabled={registerAccountMutation.isLoading}
            type='primary'
            htmlType='submit'
          >
            Đăng ký
          </Button>
        </Form.Item>
        <Form.Item>
          <Text>Đã có tài khoản ?</Text>{' '}
          <Link to={`/login${search.get('url_back') ? `?url_back=${search.get('url_back')}` : ''}`}>Đăng nhập</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default Register
