<template>
  <div class="sign-in">
    <div class="small-screen">
      <my-header v-bind="headerBind" />
      <div class="mid">
        <div class="current xy-center">
          <div v-if="isDisabled">
            <span>{{ roomDetail.roomName }}处于停诊状态，请14:00后再签到</span>
          </div>
          <div v-else>
            <span class="name">{{ roomDetail.currentPatient.patientName }}</span>
            <span>正在就诊,请耐心等待...</span>
          </div>
        </div>
        <div class="buttons xy-center">
          <el-button :disabled="isDisabled" class="btn1" type="primary" @click="onSignIn('referral')">复诊签到</el-button>
          <el-button :disabled="isDisabled" type="primary" class="btn2" @click="onSignIn('missed')">过号签到</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialog1.isShow" v-bind="dialog1.bind" @close="onDialog1Close">
      <div class="signin-dialog">
        <div class="middle" v-if="dialog1.isInput">
          输入框
        </div>
        <div class="middle" v-else>
          <span>请将条形码放置到下方扫描区域</span>
        </div>
        <div class="bottom">
          <el-button class="small-btn2 change-btn" size="mini" type="primary" @click="onChangeInput">{{ dialog1.isInput ? '扫描输入' : '手动输入' }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myHeader from '@/components/headerSmall'
import pick from 'lodash/pick'
import utils from '@/helper/utils.js'
import { REFRESH_TIME } from '@/constant/time.js'

export default {
  components: {
    myHeader,
  },
  data() {
    return {
      headerBind: {
        name: '1号诊室',
      },
      roomId: 1,
      roomDetail: {
        currentPatient: {},
      },
      timer: -1,
      dialog1: {
        bind: {
          title: '复诊签到',
          customClass: 'ht-dialog2',
          width: '6rem',
          closeOnClickModal: false,
        },
        isInput: false, // 手动输入
        isShow: false,
      },
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
    isDisabled() {
      return this.roomDetail.roomStatus === 0
    },
  },
  methods: {
    async initData() {
      this.roomDetail = await this.$api.getRoomDetail(this.roomId) // 详情:当前就诊
      this.headerBind.name = this.roomDetail.roomName
    },
    onSignIn(type) {
      this.dialog1.isShow = true
    },
    onDialog1Close() {
      this.dialog1.isShow = false
    },
    onChangeInput() {
      this.dialog1.isInput = !this.dialog1.isInput
    },
  },
}
</script>

<style lang="less">
.sign-in {
  width: 100%;
  height: 100%;
  background: white;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .small-screen {
    width: 10.24rem;
    height: 7.68rem;
    background-image: linear-gradient(to right, #00c18c 0%, #40c286 57%, #edfd92 100%);
    .mid {
      height: calc(100% - 1.2rem);
      .buttons,
      .current {
        height: 50%;
        font-size: 0.6rem;
        color: white;
        font-weight: bold;
      }
      .current {
        .name {
          color: #ff7271;
          font-size: .6rem;
         text-shadow:#fff 1px 0 0,#fff 0 1px 0,#fff -1px 0 0,#fff 0 -1px 0;
        }
      }
      .el-button {
        font-size: 0.4rem;
        padding: 0.2rem;
      }
      .btn1,.btn2 {
        margin-right: 0.6rem;
        border-color: #edff75;
  background-color: #edff75;
  color:#3f4d6a
      }
  //      .btn2 {
  //       margin-right: 0.6rem;
  //       border-color: #154053;
  // background-color: #154053;
  // color:#fff
  //     }
    }
  }
  .signin-dialog {
    height: 2rem;
    display: flex;
    flex-direction: column;
    .middle {
      flex: 5;
      display: flex;
      align-items: center;
      margin: auto;
      font-size: 0.36rem;
      color: black;
    }
    .bottom {
      flex: 2;
      display: flex;
      align-items: center;
      margin: auto;
      .change-btn {
        font-size: 0.26rem;
        padding: 0.12rem 0.3rem;
      }
    }
  }
}
</style>
