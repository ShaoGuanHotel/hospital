import axios from './httpService'
export default {
  getJson(name = 'test') {
    return axios.get(`hotel/static/json/${name}.json`)
  },
  getLevels() {
    return axios.get(`/rest/patient/levels`)
  },
  // 查询房间列表
  getRooms() {
    return axios.get(`/rest/patient/rooms`)
  },
  // 查询房间病人列表
  getRoomPatients(roomId) {
    return axios.get(`/rest/patient/room`, { roomId })
  },
  // 转诊
  changePatientRoom(params) {
    return axios.post(`/rest/patient/room`, params)
  },
  getRoomDetail(roomId) {
    return axios.get(`/rest/room`, { roomId })
  },
  // 修改房间状态
  changeRoomState(params) {
    return axios.post(`/rest/room/state`, params)
  },
  // 修改病人状态
  changePatientState(params) {
    return axios.post(`/rest/room/patient/state`, params)
  },
  // 修改病人顺序
  changeOrder(params) {
    return axios.post(`/rest/patient/room/order`, params)
  },
  // 删除病人
  deletePatient(requestId) {
    return axios.delete(`/rest/patient/request`, { requestId })
  },
  // 获取过号、待复诊患者列表 http://patientlist.7sugou.cn/rest/patient/roomAndStatus?roomId=1&status=2
  getMisseds() {
    return axios.get(`/rest/patient/roomAndStatus`, { status: -1 })
  },
  // 呼叫
  getCallingList() {
    return axios.get(`/rest/callingList`)
  },
  // 复诊
  onReviewSignIn(data) {
    return axios.put(`/rest/patient/request/review`, data)
  },
  // 过号签到
  onMissedSignIn(data) {
    return axios.put(` /rest/patient/request/notontime`, data)
  },
}
