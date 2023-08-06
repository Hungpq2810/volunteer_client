import React, { useContext } from 'react'
import { Avatar, Button, Dropdown, Layout, Space, Typography } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  IdcardOutlined,
  LogoutOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { AppContext } from '../../contexts/app.context'
import { useMutation } from 'react-query'
import AuthApi from '../../apis/auth.api'
import { Link } from 'react-router-dom'

const { Header: MainHeader } = Layout
const { Text } = Typography

const Header = ({ collapsed, setCollapsed, linkHome }) => {
  const { setIsAuthenticated, profile } = useContext(AppContext)
  const logoutAcountMutation = useMutation({
    mutationFn: () => AuthApi.logoutAccount(),
    onSuccess: () => {
      setIsAuthenticated(false)
    }
  })
  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
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
      icon: <LogoutOutlined onClick={handleLogout} />
    }
  ]
  return (
    <MainHeader
      style={{
        padding: 0,
        background: '#f5f5f5',
        paddingRight: 30
      }}
    >
      {/* <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        // onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64
        }}
      /> */}
      <Space style={{ float: 'right' }}>
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
    </MainHeader>
  )
}

export default Header
