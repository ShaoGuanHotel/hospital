<template>
  <div class="nurse-page">
    <div class="nurse">
      <div class="body">
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
          <el-button :disabled="isNoNext" class="small-btn long-btn gray" size="small" @click="onPass">过号</el-button>
          <el-button :disabled="isNoNext" class="small-btn long-btn green color_white" size="small" @click="onArrived">到诊</el-button>
        </div>
        <div class="mid">
          <el-table ref="multipleTable" :data="patients" tooltip-effect="dark" stripe style="width: 100%;" height="100%">
            <el-table-column width="100" label="序号" prop="number" />
            <el-table-column prop="patientName" label="姓名" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import utils from '@/helper/utils.js'
import { REFRESH_TIME } from '@/constant/time.js'

export default {
  data() {
    return {
      patients: [],
      isWork: true,
      roomName: '1号诊室',
      currentPatient: {}, // 当前就诊
      roomId: 1,
      timer:-1,
    }
  },
  created() {
    this.roomId = utils.getParamByName('roomId') // url获取当前诊室id
    this.initData()
  },
  mounted() {
    this.timer = setInterval(() => this.initData(), REFRESH_TIME)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  computed: {
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
    async initData() {
      const roomData = await this.$api.getRoomPatients(this.roomId) // 病人列表
      const roomDetail = await this.$api.getRoomDetail(this.roomId) // 详情:当前就诊
      this.isWork = roomDetail.roomStatus === 1 // 是否开诊
      this.roomName = roomDetail.roomName
      this.currentPatient = roomDetail.currentPatient || {}
      roomData.patients.forEach((item, index) => (item.number = index + 1))
      this.patients = roomData.patients
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
      await this.$api.changePatientState({
        ...pick(this.nextPatient, ['patientId', 'requestId']),
        requestStatus,
      })
      this.initData() // 刷新当前就诊人
    },
  },
}
</script>

<style lang="less">
.nurse-page {
  width: 100%;
  height: 100%;
  background: white;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .nurse {
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
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        font-size: 0.3rem;
        font-weight: bold;
        .el-button--success{
          background-color: #04c18b;
          border-color: #04c18b;
        }
      }
      .title{
        font-size: 0.24rem;
        font-weight: normal;
      }
      .title {
        .right {
          line-height: 0.4rem;
        }
      }
      .current {
        width: 100%;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.2rem;
      }
      .pass {
        width: 100%;
        height: 0.5rem;
        line-height: 0.5rem;
        .green {
          // background: rgb(4, 193, 139);
          background:#fff;
          color:#04c18b;
          border: 1px solid #d7d7d7;
          font-weight: bold;
        }
        .gray {
          // background: rgb(220, 215, 219);
          background: #fff;
          border: 1px solid #d7d7d7;
          margin-right: 0.54rem;
          color:#333;
          font-weight: bold;
        }
      }
      .mid {
        height: calc(100% - 2rem);
        margin-top: 0.1rem;
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
    }
  }
  .call-btn {
    width: 100%;
    height: 0.4rem;
    font-size: 0.2rem;
  }
}
</style>
