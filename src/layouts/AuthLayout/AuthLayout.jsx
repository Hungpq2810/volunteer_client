import { Breadcrumb, Layout, Menu, theme } from 'antd'
const { Header, Content, Footer } = Layout

const AuthLayout = ({ children }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  return (
    <Layout style={{ minHeight: '100vh', backgroundImage: 'url(https://veo.com.vn/wp-content/uploads/2020/03/45089349461_8545249f40_z.jpeg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <Content
        className='site-layout'
        style={{
          padding: '50px 50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            width: 600,
            borderRadius: 8
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  )
}

export default AuthLayout
