<template>
  <div class="doctor-page">
    <div class="doctor">
      <div class="body" v-if="!isHadSetRoom">
        <div class="title">
          <span>选择诊室</span>
        </div>
        <div class="select-room">
          <div class="rooms">
            <div class="room-btn" v-for="room in rooms" :key="room.roomId">
              <el-button class="call-btn" type="success" @click="onSelectRoom(room.roomId)">{{ room.roomName }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="body">
        <div class="title">
          <div class="left">
            <span>{{ roomName }}</span>
          </div>
          <div class="right">
            <el-tooltip effect="dark" :content="switchTitle" placement="left">
              <el-switch v-model="isWork" @change="onChangeRoomState"></el-switch>
            </el-tooltip>
          </div>
        </div>
        <div class="current">
          <div class="left">
            <span>当前就诊 : {{ currentPatient.patientName }}</span>
          </div>
          <div class="right">
            <span>候诊人数 : {{ patients.length }}</span>
          </div>
        </div>
        <div class="call">
          <el-button :disabled="isNoNext" class="call-btn" type="success" @click="onCall">呼叫 {{ nextPatient.patientName }}</el-button>
        </div>
        <div class="pass">
          <el-button :disabled="isNoNext || isBtnDiabled" class="small-btn long-btn gray" size="small" @click="onPass">过号</el-button>
          <el-button :disabled="isNoNext || isBtnDiabled" class="small-btn long-btn green color_white" size="small" @click="onArrived">到诊</el-button>
        </div>
        <div class="mid">
          <el-table ref="multipleTable" :data="patients" tooltip-effect="dark" stripe style="width: 100%;" height="100%">
            <el-table-column width="50" prop="number" />
            <el-table-column width="100" label="预约号" prop="requestCode" />
            <el-table-column prop="patientName" label="姓名" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import { REFRESH_TIME, BTN_DISABLE_TIME } from '@/constant/time.js'

export default {
  data() {
    return {
      patients: [],
      isWork: true,
      roomName: '1号诊室',
      currentPatient: {}, // 当前就诊
      roomId: 0,
      timer: -1,
      rooms: [], // 诊室
      isBtnDiabled: false, // 按钮置灰 避免多次点击
    }
  },
  created() {
    this.initRooms()
  },
  mounted() {
    this.timer = setInterval(() => this.initData(), REFRESH_TIME)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  computed: {
    // 已经选择过诊室
    isHadSetRoom() {
      return this.roomId > 0
    },
    // 下一位
    nextPatient() {
      return this.patients[0] || {}
    },
    // 没有下一位
    isNoNext() {
      return this.patients.length === 0
    },
    switchTitle() {
      return this.isWork ? '开诊状态' : '停诊状态'
    },
  },
  methods: {
    async initRooms() {
      const data = await this.$api.getRooms()
      this.rooms = data.rooms
    },
    async initData() {
      if (!this.isHadSetRoom) return
      const roomData = await this.$api.getRoomPatients(this.roomId) // 病人列表
      const roomDetail = await this.$api.getRoomDetail(this.roomId) // 详情:当前就诊
      this.isWork = roomDetail.roomStatus === 1 // 是否开诊
      this.roomName = roomDetail.roomName
      this.currentPatient = roomDetail.currentPatient || {}
      roomData.patients.forEach((item, index) => (item.number = index + 1))
      this.patients = roomData.patients
    },
    onSelectRoom(roomId) {
      this.roomId = roomId
      this.initData()
    },
    // 切换就诊状态
    onChangeRoomState(val) {
      this.$api.changeRoomState({
        roomId: this.roomId,
        roomStatus: val ? 1 : 0,
      })
    },
    /**
     * 呼叫下一位
     * 不刷新数据
     */
    async onCall() {
      if (this.isNoNext) return
      const requestStatus = 1
      await this.$api.changePatientState({
        ...pick(this.nextPatient, ['patientId', 'requestId']),
        requestStatus,
      })
    },
    // 过号
    onPass() {
      if (this.isNoNext) return
      const requestStatus = 3
      this.changePatientState(requestStatus)
    },
    // 到诊
    onArrived() {
      if (this.isNoNext) return
      const requestStatus = 2
      this.changePatientState(requestStatus)
    },
    async changePatientState(requestStatus) {
      this.isBtnDiabled = true
      await this.$api.changePatientState({
        ...pick(this.nextPatient, ['patientId', 'requestId']),
        requestStatus,
      })
      await this.initData() // 刷新当前就诊人
      setTimeout(() => (this.isBtnDiabled = false), BTN_DISABLE_TIME)
    },
  },
}
</script>

<style lang="less">
.doctor-page {
  width: 100%;
  height: 100%;
  background: white;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .doctor {
    width: 4rem;
    height: 100%;
    box-shadow: inset 0 0 0.04rem rgba(4, 193, 139, 0.2);
    .body {
      margin: 0 0.15rem;
      width: calc(100% - 0.3rem);
      height: calc(100% - 0.3rem);
      .title,
      .call {
        width: 100%;
        height: 0.5rem;
        line-height: 0.4rem;
        text-align: center;
        font-size: 0.3rem;
        font-weight: bold;
        .el-button--success {
          background-color: #04c18b;
          border-color: #04c18b;
        }
        .el-button--success:hover {
          background-color: #a1e680;
          border-color: #a1e680;
        }
        .el-button--success:active {
          background-color: #058b65;
          border-color: #058b65;
        }
      }
      .title {
        text-align: left;
        font-size: 0.24rem;
        font-weight: normal;
        margin: 0 -0.15rem;
        line-height: 0.5rem;
        background-image: linear-gradient(to right, #00c18c 0%, #40c286 57%, #edfd92 100%);
        padding: 0 0.15rem;
        color: white;
        .right {
          line-height: 0.4rem;
          .el-switch.is-checked .el-switch__core {
            border-color: #0ac18a;
            background-color: #0ac18a;
          }
        }
      }
      .current {
        width: 100%;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.2rem;
        margin-top: 0.1rem;
      }
      .pass {
        width: 100%;
        height: 0.5rem;
        line-height: 0.5rem;
        .green {
          background: #fff;
          color: #04c18b;
          border: 1px solid #d7d7d7;
          font-weight: bold;
        }
        .green:hover,
        .gray:hover {
          background-color: #a1e680;
          border-color: #a1e680;
        }
        .gray {
          background: #fff;
          border: 1px solid #d7d7d7;
          margin-right: 0.54rem;
          color: #333;
          font-weight: bold;
        }
      }
      .mid {
        height: calc(100% - 1.8rem);
        overflow-y: auto;
        .el-table {
          .cell {
            text-align: center;
          }
          tr.current-row > td {
            background-color: rgb(4, 193, 139);
          }
        }
      }
      .small-btn {
        padding: 0.08rem 0.2rem;
        font-size: 0.12rem;
      }
      .long-btn {
        padding: 0.08rem 0.58rem;
        font-size: 0.16rem;
      }
      .select-room {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        .rooms {
          flex: 1;
          height: 50%;
          .room-btn {
            height: 0.5rem;
            margin: 0.2rem 0.5rem;
          }
        }
      }
    }
  }
  .call-btn {
    width: 100%;
    height: 0.4rem;
    font-size: 0.2rem;
  }
  .call-btn:focus{
    color:white
  }
}
</style>
