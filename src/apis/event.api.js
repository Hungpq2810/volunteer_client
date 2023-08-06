import http from '../utils/http'

class EventApi {
  static getMyEvent = (status) => http.get(`/event/my-event?status=${status}`)
  static getEvents = (status) => http.get(`/event?status=${status}`)
  static getEventsComing = () => http.get(`/event/coming`)
  static createEvent = (body) => http.post(`/event`, body)
  static getEvent = (slug) => http.get(`/event/${slug}`)
  static updateEvent = (id, body) => http.patch(`/event/${id}`, body)
  static approve = (id) => http.patch(`/event/approve/${id}`)
  static reject = (id) => http.patch(`/event/reject/${id}`)
  static join = (id) => http.post(`/event/join/${id}`)
  static eventJoined = () => http.get('event/event-joined')
  static getEventsSearch = (params) =>
    http.get(`/event/coming`, {
      params
    })
  static cancel = (id) => http.patch(`/event/cancel/${id}`)
}

export default EventApi
