import http from '../utils/http'

class FeedbackApi {
  static createFeedback = (body) => http.post(`/feedback`, body)
  static getAllFeedback = () => http.get(`/feedback`)
}

export default FeedbackApi
