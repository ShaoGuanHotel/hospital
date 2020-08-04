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
    return axios.get(`/rest/patient/roomAndStatus`, {  status: -1 })
  },
  // 呼叫 
  getCallingList() {
    return axios.get(`/rest/callingList`)
  },
  /**
   * 
  语音呼叫、文字呼叫接口已经完成。
  调用地址：GET https://patientlist.7sugou.cn/rest/callingList
  响应示例：
  {
    callings:[
      {
        patient:{
          name:'马佩煜',
          room:'诊室1'
        },
        wavSource:'-18-51-49-17-57-54-1c-43-57-19-7b-64-1b-78-50-18-51-76-1b-52-5c31-1b-50-4f-18-51-76.wav'
      },
      {
        patient:{
          name:'马佩煜2',
          room:'诊室2'
        },
        wavSource:'-18-51-49-17-57-54-1c-43-57-19-7b-64-1b-78-50-18-51-76-1b-52-5c31-1b-50-4f-18-51-76.wav'
      }
    ]
  }
  {"callingTexts":["请马佩煜到诊室1就诊","请周宥霖到诊室2就诊","请周忠到诊室3就诊"],"callingAudioFiles":["-18-51-49-17-57-54-1c-43-57-19-7b-64-1b-78-50-18-51-76-1b-52-5c31-1b-50-4f-18-51-76.wav","-18-51-49-1b-6f-58-1b-52-5b-17-64-6a-1b-78-50-18-51-76-1b-52-5c32-1b-50-4f-18-51-76.wav","-18-51-49-1b-6f-58-1b-41-60-1b-78-50-18-51-76-1b-52-5c33-1b-50-4f-18-51-76.wav"]}
  收到响应后，循环显示文字呼叫信息callingTexts；
  收到响应后，循环播放语言呼叫音频文件callingAudioFiles；
  语言呼叫音频文件地址需要用程序拼接，示例：https://patientlist.7sugou.cn/rest/audio/-18-51-49-1b-6f-58-1b-41-60-1b-78-50-18-51-76-1b-52-5c33-1b-50-4f-18-51-76.wav
  建议调用此接口的定时器周期不小于5秒，再加上一个判断：至少完成一遍循环播放（文字、音频）且完整播放最后一个音频文件（不要让呼叫语言在文件播放中被切断）。
   */
}
