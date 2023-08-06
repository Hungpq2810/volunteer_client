import { Button, Col, Row, Space } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { FacebookOutlined, YoutubeOutlined, InstagramOutlined, SkypeOutlined, GooglePlusOutlined } from '@ant-design/icons'

const Footer = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <ul>
          <li>Được xây dựng và chịu trách nhiệm bởi Phí Quốc Hưng </li>
          <li>Email: hungphiquoc@gmail.com </li>
          <li>
            <Link to={'/term'}>Quy định và chính sách (link) </Link>
          </li>
          <li>
            <Link to={'/faq'}>Câu hỏi thường gặp </Link>
          </li>
        </ul>
      </Col>
      <Col span={12}>
        <Space>
          <Button type='link' icon={<FacebookOutlined />}></Button>
          <Button type='link' icon={<YoutubeOutlined />}></Button>
          <Button type='link' icon={<InstagramOutlined />}></Button>
          <Button type='link' icon={<SkypeOutlined />}></Button>
          <Button type='link' icon={<GooglePlusOutlined />}></Button>
        </Space>
      </Col>
    </Row>
  )
}

export default Footer
