import React from 'react'
import { useQuery } from 'react-query'
import GenApi from '../../apis/gen.api'
import { Card } from 'antd'

const Term = () => {
  const { data: term } = useQuery({
    queryKey: ['term'],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return GenApi.getGen('term')
    },
    keepPreviousData: true,
    retry: 0
  })

  const termValue = term?.data?.metadata?.gen.v || null
  return (
    <Card>
      <div dangerouslySetInnerHTML={{ __html: termValue }} />
    </Card>
  )
}

export default Term
