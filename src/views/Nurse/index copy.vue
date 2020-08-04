<template>
  <div class="nurse-page">
    <div class="nurse">
      <div class="top0">
        <span>急诊排队叫号</span>
      </div>
      <div class="body">
        <div class="top">
          <el-select v-model="currentRoomId" placeholder="请选择">
            <el-option v-for="item in rooms" :key="item.roomId" :label="getLabel(item)" :value="item.roomId"> </el-option>
          </el-select>
        </div>
        <div class="search">
          <el-input placeholder="请输入预约号或者姓名" v-model="searchValue" @keyup.enter.native="onSearch" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search" @click="onSearch"></i>
          </el-input>
        </div>
        <div class="mid">
          <el-table
            v-if="currentRoom && currentRoom.patients"
            ref="multipleTable"
            :data="patients"
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
      </div>
    </div>
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
      isShowBtns: false,
      originIds: [],
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
      searchValue: '', // 手所指
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.timer = setInterval(() => this.initData(true), REFRESH_TIME)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  computed: {
    currentRoom() {
      return this.rooms.find(({ roomId }) => roomId === this.currentRoomId)
    },
    patients() {
      return this.currentRoom.patients.filter((item) => item.isFixSearch)
    },
    // 没有选中任何行
    isNoCurrentRow() {
      return JSON.stringify(this.currentClick) === '{}'
    },
  },
  watch: {
    searchValue(val, oldVal) {
      // 清空
      if (oldVal !== '' && val === '') {
        this.clearFilter()
      }
    },
  },
  methods: {
    async initData(isFromTimer) {
      const data = await this.$api.getRooms()
      data.rooms.forEach((room) => {
        room.patients.forEach((patient, index) => {
          patient.number = index + 1
          patient.isFixSearch = isFixSearch(patient, this.searchValue)
        })
      })
      this.rooms = data.rooms
      isFromTimer && this.updateCurrent()
    },
    onSearch() {
      this.currentRoom.patients.forEach((patient) => (patient.isFixSearch = isFixSearch(patient, this.searchValue)))
    },
    clearFilter() {
      this.currentRoom.patients.forEach((patient) => {
        patient.isFixSearch = true
      })
    },
    // option label
    getLabel(item) {
      return `${item.roomName}(${item.patients.length}人)`
    },
    // CheckBox change
    onSelect(val) {
      this.currentClick = val || this.currentClick
      this.isShowBtns = false
    },
    onShowBtns() {
      this.isShowBtns = !this.isShowBtns
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
      }
      .search {
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
        height: calc(100% - 1.44rem);
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
        .text-left {
          text-align: left;
        }
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
