import http from '../utils/http'

class GenApi {
  static saveGen = (body) => http.post(`/general`, body)
  static getGen = (k) => http.get(`/general/${k}`)
}

export default GenApi
