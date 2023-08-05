import React, { useState } from 'react'
import { Button, Popconfirm, Space, Table, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import UserApi from '../../apis/user.api'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const ListUser = ({ setIsModalOpen, setUserId }) => {
  const [sortedInfo, setSortedInfo] = useState({})
  const queryClient = useQueryClient()
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter)
  }
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return UserApi.getListUser()
    },
    keepPreviousData: true,
    retry: 0
  })

  const handleOpenUpdateUserModal = (id) => {
    setUserId(id)
    setIsModalOpen(true)
  }

  const deleteUserMutation = useMutation({
    mutationFn: (id) => UserApi.deleteUser(id),
    onSuccess: (_) => {
      message.success(`Xóa thành công user`)
      queryClient.invalidateQueries({ queryKey: ['users'], exact: true })
    }
  })

  const handleDelete = (id) => {
    deleteUserMutation.mutate(id)
  }

  const users = data?.data?.metadata?.users.data || []
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // sorter: (a, b) => a.email - b.email,
      // sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      // sorter: (a, b) => a.email - b.email,
      // sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phone',
      // sorter: (a, b) => a.email - b.email,
      // sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true
    },

    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      // sorter: (a, b) => a.address.length - b.address.length,
      // sortOrder: sortedInfo.columnKey === 'role' ? sortedInfo.order : null,
      ellipsis: true
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      ellipsis: true,
      fixed: 'right',
      render: (data) => {
        return (
          <>
            <Button
              onClick={() => handleOpenUpdateUserModal(data.id)}
              style={{ color: '#ff9a3f' }}
              icon={<EditOutlined />}
              type='ghost'
              shape='circle'
            ></Button>
            <Popconfirm
              title='Xóa user'
              description='Bạn có chắc xóa user này không?'
              onConfirm={() => handleDelete(data.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <Button
                style={{ color: 'red' }}
                icon={<DeleteOutlined />}
                type='ghost'
                shape='circle'
              ></Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]
  return (
    <>
      <Table loading={isLoading} columns={columns} dataSource={users} onChange={handleChange} />
    </>
  )
}

export default ListUser
