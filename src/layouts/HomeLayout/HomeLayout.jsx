import React, { useContext } from 'react'
import { Avatar, Breadcrumb, Button, Dropdown, Image, Layout, Menu, Space, Typography, theme } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  IdcardOutlined,
  LogoutOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'
const { Header, Content, Footer } = Layout
const { Text } = Typography
const HomeLayout = ({ children }) => {
  const { setIsAuthenticated, profile, setProfile, isAuthenticated } = useContext(AppContext)
  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    setProfile(null)
  }
  const items = [
    {
      label: <Link to={'/profile'}>Thông tin cá nhân</Link>,
      key: '1',
      icon: <IdcardOutlined />
    },
    {
      label: <Link to={'/my-event'}>Quản lí sự kiện</Link>,
      key: '3',
      icon: <BarChartOutlined />
    },
    {
      label: <Text onClick={handleLogout}>Đăng xuất</Text>,
      key: '2',
      icon: <LogoutOutlined />
    }
  ]
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 99,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        <Link to={'/'}>
          <div className='demo-logo demo-logo-vertical '>
            <Image
              width={100}
              preview={false}
              src='https://veo.com.vn/wp-content/uploads/2020/06/cropped-Logo-VEO.png'
            />
          </div>
        </Link>
        <Link to={'/events'}>
          <Button type='ghost'>Các sự kiện</Button>
        </Link>
        <Link to={'/faq'}>
          <Button type='ghost'>Các câu hỏi thường gặp</Button>
        </Link>
        <Link to={'/term'}>
          <Button type='ghost'>Quy định và điều khoản</Button>
        </Link>
        {!isAuthenticated && (
          <Space style={{ marginLeft: 'auto' }}>
            <Link to={'/login'}>
              <Button type='primary'>Đăng nhập</Button>
            </Link>
          </Space>
        )}
        {isAuthenticated && (
          <Space style={{ marginLeft: 'auto' }}>
            <Text>{profile?.username}</Text>
            <Dropdown
              menu={{
                items
              }}
              placement='bottomRight'
            >
              <Avatar icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        )}
      </Header>
      <Content
        className='site-layout'
        style={{
          padding: '0 50px'
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380
            // background: colorBgContainer
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center'
        }}
      >
        Volunteer ©2023 Created by Sudev
      </Footer>
    </Layout>
  )
}
export default HomeLayout
