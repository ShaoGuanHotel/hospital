<template>
  <div class="nurse-page">
    <div class="nurse">
      <div class="top0">
        <span>急诊排队叫号</span>
      </div>
      <div class="body">
        <el-tabs v-model="activeName">
          <!-- 页签1 -->
          <el-tab-pane label="叫号队列" name="first">
            <div class="top">
              <el-select v-model="currentRoomId" placeholder="请选择">
                <el-option v-for="item in rooms" :key="item.roomId" :label="getLabel(item)" :value="item.roomId"> </el-option>
              </el-select>
            </div>
            <div class="mid">
              <el-table
                v-if="currentRoom && currentRoom.patients"
                ref="multipleTable"
                :data="currentRoom.patients"
                tooltip-effect="dark"
                highlight-current-row
                style="width: 100%;"
                height="100%"
                stripe
                @current-change="onSelect"
              >
                <el-table-column width="50" prop="number" />
                <el-table-column width="80" label="预约号" prop="requestCode" />
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <div :class="['patient-name', scope.row.patientId === currentClick.patientId && isShowBtns ? 'text-left' : '']">
                      <span>{{ scope.row.patientName }}</span>
                      <span v-if="scope.row.patientId === currentClick.patientId" class="handle-btns">
                        <span v-if="isShowBtns">
                          <el-button class="small-btn2" size="mini" type="danger" @click="onDelete">删除</el-button>
                          <el-button class="small-btn2" size="mini" type="success" @click="onMove">转诊</el-button>
                        </span>
                        <i :class="[isShowBtns ? 'el-icon-arrow-right' : 'el-icon-arrow-left']" @click="onShowBtns"></i>
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="bottom1">
              <el-button
                v-for="button in buttons"
                :disabled="isNoCurrentRow"
                :key="button.eventKey"
                :class="['small-btn', button.class]"
                :eventKey="button.eventKey"
                size="small"
                @click="onClickBtn(button)"
              >
                {{ button.label }}
              </el-button>
            </div>
          </el-tab-pane>
          <!-- 页签2 -->
          <el-tab-pane label="过号、复诊" name="second">
            <div class="top">
              <el-input placeholder="请输入预约号或者姓名" v-model="tab2.searchValue" @keyup.enter.native="onSearch" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search" @click="onSearch"></i>
              </el-input>
            </div>
            <div class="mid tab2-mid">
              <el-table ref="multipleTable2" :data="tab2Patients" tooltip-effect="dark" highlight-current-row style="width: 100%;" height="100%" stripe @current-change="onSelect2">
                <el-table-column width="50">
                  <template slot-scope="scope">
                    <div class="patient-tag">
                      <el-tooltip v-if="scope.row.requestStatus === 3" effect="dark" content="过号" placement="right">
                        <div class="tag red">
                          <span>过</span>
                        </div>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="80" label="预约号" prop="requestCode" />
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <div :class="['patient-name', scope.row.patientId === currentClick2.patientId && isShowBtns2 ? 'text-left' : '']">
                      <span>{{ scope.row.patientName }}</span>
                      <span v-if="scope.row.patientId === currentClick2.patientId" class="handle-btns">
                        <span v-if="isShowBtns2">
                          <el-button class="small-btn2" size="mini" type="success" @click="onSignIn">签到</el-button>
                        </span>
                        <i :class="[isShowBtns2 ? 'el-icon-arrow-right' : 'el-icon-arrow-left']" @click="onShowBtns2"></i>
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 转诊 -->
    <el-dialog :visible.sync="isChangeRoomShow" v-bind="dialog.bind" @close="onMoveCancel">
      <div class="select-room">
        <select-span v-for="room in dialog.data" :key="room.roomId" :room="room" @click="onSelectRoom" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="small-btn" @click="onMoveCancel">取 消</el-button>
        <el-button class="small-btn" type="primary" @click="onMoveOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 由于需求变动比较大:单页面-->多页签页面,为了追求开发效率,很多代码都重复了
import selectSpan from '@/components/selectSpan'
import pick from 'lodash/pick'
import { REFRESH_TIME } from '@/constant/time.js'

const isFixSearch = ({ patientName, requestCode }, searchValue) => {
  if (searchValue === '') return true
  return `${patientName}${requestCode}`.toLocaleLowerCase().includes(searchValue.trim().toLocaleLowerCase())
}

export default {
  components: {
    selectSpan,
  },
  data() {
    return {
      buttons: [
        { label: '置顶', class: '', eventKey: 'onToTop' },
        { label: '上移', class: '', eventKey: 'onMoveUp' },
        { label: '下移', class: '', eventKey: 'onMoveDown' },
        { label: '取消', class: 'gray', eventKey: 'onCancel' },
        { label: '确定', class: 'green', eventKey: 'onOK' },
      ],
      timer: -1,
      rooms: [],
      currentRoomId: '1',
      currentClick: {}, // 当前选中的行
      currentClick2: {}, // 当前选中的行
      isShowBtns: false,
      isShowBtns2: false,
      isChangeRoomShow: false,
      dialog: {
        bind: {
          customClass: 'ht-dialog',
          title: '提示',
          width: '3.6rem',
          closeOnClickModal: false,
        },
        data: [],
      },
      activeName: 'first',
      // 第二个页签数据模型
      tab2: {
        searchValue: '',
        patients: [],
      },
    }
  },
  created() {
    this.initData()
    this.initData2()
  },
  mounted() {
    this.timer = setInterval(() => {
      this.initData(true)
      this.initData2()
    }, REFRESH_TIME)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  computed: {
    currentRoom() {
      return this.rooms.find(({ roomId }) => roomId === this.currentRoomId)
    },
    // 没有选中任何行
    isNoCurrentRow() {
      return JSON.stringify(this.currentClick) === '{}'
    },
    isNoCurrentRow2() {
      return JSON.stringify(this.currentClick2) === '{}'
    },
    tab2Patients() {
      return this.tab2.patients.filter((item) => item.isFixSearch)
    },
  },
  methods: {
    async initData(isFromTimer) {
      const data = await this.$api.getRooms()
      data.rooms.forEach((room) => {
        room.patients.forEach((patient, index) => (patient.number = index + 1))
      })
      this.rooms = data.rooms
      isFromTimer && this.updateCurrent()
    },
    async initData2() {
      const { patients } = await this.$api.getMisseds()
      patients.forEach((patient, index) => {
        patient.number = index + 1
        patient.isFixSearch = isFixSearch(patient, this.tab2.searchValue)
      })
      this.tab2.patients = patients
      this.updateCurrent2()
    },
    // option label
    getLabel(item) {
      return `${item.roomName}(${item.patients.length}人)`
    },
    // CheckBox change
    onSelect(val) {
      this.currentClick = val || this.currentClick
    },
    onSelect2(val) {
      this.currentClick2 = val || this.currentClick2
    },
    onShowBtns() {
      this.isShowBtns = !this.isShowBtns
    },
    onShowBtns2() {
      this.isShowBtns2 = !this.isShowBtns2
    },
    // 更新当前选中,因为刷新数据后选中的对象发生了改变,不能===
    updateCurrent() {
      if (this.isNoCurrentRow) return
      const currentClick = this.currentRoom.patients.find((item) => item.patientId === this.currentClick.patientId)
      this.currentRoom.patients = this.currentRoom.patients.filter((item) => item !== currentClick)
      this.currentRoom.patients.splice(this.currentClick.number - 1, 0, currentClick)
      // 同步order
      this.currentRoom.patients.forEach((item, number) => (item.number = number + 1))
      this.$refs.multipleTable.setCurrentRow(currentClick)
    },
    updateCurrent2() {
      if (this.isNoCurrentRow2) return
      const currentClick = this.tab2.patients.find((item) => item.patientId === this.currentClick2.patientId)
      this.tab2.patients = this.tab2.patients.filter((item) => item !== currentClick)
      this.tab2.patients.splice(this.currentClick2.number - 1, 0, currentClick)
      // 同步order
      this.tab2.patients.forEach((item, number) => (item.number = number + 1))
      this.$refs.multipleTable2.setCurrentRow(currentClick)
    },
    async onOK() {
      await this.$api.changeOrder({
        ...pick(this.currentClick, ['patientId', 'requestId']),
        comment: 'la la la la',
        newOrderIndex: this.currentRoom.patients.indexOf(this.currentClick),
      })
      this.onCancel()
    },
    onCancel() {
      this.currentClick = {}
      this.initData()
    },
    onClickBtn(button) {
      if (!button || this.isNoCurrentRow) return
      this[button.eventKey] && this[button.eventKey]()
    },
    // 置顶
    onToTop() {
      this.currentClick.number = -1
      this.reOrder()
    },
    // 上移
    onMoveUp() {
      this.currentClick.number -= 2
      this.reOrder()
    },
    // 下移
    onMoveDown() {
      this.currentClick.number += 2
      this.reOrder()
    },
    // 删除
    onDelete() {
      this.SimpleUI.confirm({
        message: `确定删除 ${this.currentClick.patientName} ?`,
        okFn: async () => {
          const data = await this.$api.deletePatient(this.currentClick.requestId)
          this.currentClick = {}
          this.initData()
        },
      })
    },
    // 转移
    async onMove() {
      await this.initData()
      this.dialog.data = this.rooms
        .filter(({ roomStatus, roomId }) => roomStatus === 1 && roomId !== this.currentRoomId)
        .map((room, index) => ({
          name: room.roomName,
          isSelect: false,
          roomId: room.roomId,
          ref: `selectRoom${index}`,
        }))
      this.isChangeRoomShow = true
    },
    // 转移取消
    onMoveCancel() {
      this.isChangeRoomShow = false
    },
    // 转移校验
    isCanMove() {
      return this.dialog.data.some((item) => item.isSelect)
    },
    onSelectRoom(room) {
      this.dialog.data.forEach((item) => (item.isSelect = false))
      room.isSelect = true
    },
    // 转移确定
    async onMoveOK() {
      if (!this.isCanMove()) {
        this.SimpleUI.warning('请选择要转移的诊室')
        return
      }
      const postData = {
        ...pick(this.currentClick, ['requestId', 'patientId']),
        newRoomId: this.dialog.data.find((room) => room.isSelect).roomId,
        comment: 'la la la la',
      }
      await this.$api.changePatientRoom(postData)
      this.currentClick = {}
      this.initData()
      this.isChangeRoomShow = false
    },
    // 重新排序
    reOrder() {
      this.currentRoom.patients = this.currentRoom.patients.sort((itemA, itemB) => itemA.number - itemB.number)
      this.currentRoom.patients.forEach((item, index) => (item.number = index + 1))
    },
    // ----------------------------------------------------------- 页签2 -----------------------------------------------------------
    // 搜索
    onSearch() {
      this.tab2.patients.forEach((patient) => (patient.isFixSearch = isFixSearch(patient, this.tab2.searchValue)))
    },
    clearFilter() {
      this.tab2.patients.forEach((patient) => (patient.isFixSearch = true))
    },
    // 签到
    async onSignIn() {
      const api = this.currentClick2.requestStatus === 3 ? this.$api.onMissedSignIn : this.$api.onReviewSignIn
      const postData = pick(this.currentClick2, ['requestId', 'patientId'])
      await api(postData)
      this.initData2()
      this.currentClick2 = {}
    },
  },
  watch: {
    'tab2.searchValue'(val, oldVal) {
      // 清空
      if (oldVal !== '' && val === '') {
        this.clearFilter()
      }
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
    .top0 {
      width: 100%;
      line-height: 0.5rem;
      text-align: left;
      font-size: 0.22rem;
      color: white;
      height: 0.5rem;
      background-image: linear-gradient(to right, #00c18c 0%, #40c286 57%, #edfd92 100%);
      span {
        padding-left: 0.15rem;
      }
    }
    .body {
      margin: 0 0.15rem;
      width: calc(100% - 0.3rem);
      height: calc(100% - 0.5rem);
      .top {
        width: 100%;
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.2rem;
        .el-input__icon {
          position: relative;
          top: 0.04rem;
        }
      }
      .mid {
        height: calc(100% - 0.94rem);
        margin-top: 0.02rem;
        overflow-y: auto;
        .el-table {
          .cell {
            text-align: center;
          }
          tr > td {
            padding: 0;
          }
          tr > td > .cell {
            height: 0.4rem;
            line-height: 0.4rem;
          }
          tr.current-row > td {
            background-color: rgb(4, 193, 139);
          }
        }
        .patient-name {
          width: 100%;
          height: 100%;
          position: relative;
          .handle-btns {
            position: absolute;
            right: 0;
          }
        }
        .patient-tag {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          .tag {
            width: 0.3rem;
            height: 0.3rem;
            border-radius: 50%;
            line-height: 0.26rem;
          }
          .green {
            border: 1px solid green;
            color: green;
          }
          .red {
            border: 1px solid red;
            color: red;
          }
        }
        .text-left {
          text-align: left;
        }
      }
      .tab2-mid {
        height: calc(100% - 0.44rem);
      }
      .bottom1 {
        width: 100%;
        height: 0.4rem;
        line-height: 0.4rem;
        .green {
          background: rgb(4, 193, 139);
          border: none;
        }
        .gray {
          background: rgb(220, 215, 219);
          border: none;
        }
      }
      .small-btn2 {
        padding: 0.06rem 0.2rem;
        font-size: 0.12rem;
      }
      .long-btn {
        padding: 0.08rem 0.58rem;
      }
    }
    .el-tabs {
      height: 100%;
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__content {
        height: calc(100% - 0.4rem);
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
  .select-room {
    height: 1.3rem;
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    margin: 0.1rem 0 0 0.1rem;
  }
}
</style>
