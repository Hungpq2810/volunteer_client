import http from '../utils/http'

class FaqApi {
  static createFaq = (body) => http.post(`/faq`, body)
  static getAllFaq = () => http.get(`/faq`)
  static getFaq = (id) => http.get(`/faq/${id}`)
  static updateFaq = (id, body) => http.patch(`/faq/${id}`, body)
  static deleteFaq = (id) => http.delete(`/faq/${id}`)
}

export default FaqApi
