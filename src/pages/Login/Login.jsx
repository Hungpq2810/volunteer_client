import React, { useContext } from 'react'
import { Typography, Button, Form, Input, Divider } from 'antd'
import { useMutation } from 'react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'
import AuthApi from '../../apis/auth.api'

const { Title, Text } = Typography

const Login = () => {
  const [search] = useSearchParams()
  const navigate = useNavigate()
  console.log(search.get('url_back'));
  const { setIsAuthenticated, setProfile, setPermissions } = useContext(AppContext)
  const loginAccountMutation = useMutation({
    mutationFn: (body) => AuthApi.loginAccount(body)
  })
  const onFinish = (body) => {
    loginAccountMutation.mutate(body, {
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
      <Title level={3}>Đăng nhập</Title>
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
          label='Tên đăng nhập'
          name='username'
          rules={[
            {
              required: true,
              message: 'Khhông được bỏ trống!'
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
              message: 'Khhông được bỏ trống!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loginAccountMutation.isLoading}
            disabled={loginAccountMutation.isLoading}
            type='primary'
            htmlType='submit'
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <Form.Item>
          <Text>Chưa có tài khoản ?</Text>{' '}
          <Link to={`/register${search.get('url_back') ? `?url_back=${search.get('url_back')}` : ''}`}>Đăng ký</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default Login
