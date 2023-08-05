import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'

export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '1000',
      name: queryParams.name,
      creator: queryParams.creator,
      location: queryParams.location,
      startDate: queryParams.startDate,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
