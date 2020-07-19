import axios from './httpService'
export default {
  getJson(name = 'test') {
    return axios.get(`hotel/static/json/${name}.json`)
  },
  getLevels() {
    return axios.get(`/api/rest/patient/levels`)
  },
  // 查询房间列表
  getRooms() {
    return axios.get(`/api/rest/patient/rooms`)
  },
  // 查询房间病人列表
  getRoomPatients(roomId) {
    return axios.get(`/api/rest/patient/room`, { roomId })
  },
  getRoomDetail(roomId) {
    return axios.get(`/api/rest/room`, { roomId })
  },
  // 修改房间状态
  changeRoomState(params) {
    return axios.post(`/api/rest/room/state`, params)
  },
  // 修改病人状态
  changePatientState(params) {
    return axios.post(`/api/rest/room/patient/state`, params)
  },
}
