<template>
  <div class="notice">
    <div class="scroll" ref="scroll">
      <span v-for="(item, index) in callings" :key="index">
        <span>请</span>
        <span class="yellow">{{ item.patient.name }}</span>
        <span>到</span>
        <span class="red">{{ item.patient.room }}</span>
        <span>就诊</span>
        <span v-if="_isHadComma(index)">,</span>
      </span>
    </div>
  </div>
</template>
<script>
import { SCROLL_TIME, CALL_ONE_TIME, REFRESH_TIME } from '@/constant/time.js'

// 立刻呼叫一个
const callRightNow = (person) => {
  const wav = new Audio(`https://patientlist.7sugou.cn/rest/audio/${person.wavSource}`)
  wav.play()
}
// 延时呼叫一个
const callLater = (person) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callRightNow(person)
      resolve(1)
    }, CALL_ONE_TIME) // 延时五秒
  })
}

// 消息队列消耗
const callPatients = async (data) => {
  let persons = [...data].reverse()
  callRightNow(persons.pop()) // 立刻呼叫一个
  while (persons.length) {
    await callLater(persons.pop()) // 延时5秒循环呼叫
  }
}

// 通知
export default {
  props: {},
  data() {
    return {
      callings: [],
      scrollTimer: -1,
      timer: -1,
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.timer = setInterval(() => this.initData(), REFRESH_TIME)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  methods: {
    async initData() {
      const { callings } = await this.$api.getCallingList()
      this.callings = callings
      this.startScroll() // 开启广播文本滚动
      callPatients(callings) // 开启广播呼叫
    },
    startScroll() {
      window.clearInterval(this.scrollTimer)
      let scrollX = 0
      this.scrollTimer = setInterval(() => {
        scrollX += 1
        this.$refs.scroll && this.$refs.scroll.scrollTo(scrollX, 0)
      }, SCROLL_TIME)
    },
    _isHadComma(index) {
      return index < this.callings.length - 1
    },
  },
}
</script>
<style lang="less">
.notice {
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.4rem;
  width: 100%;
  .scroll {
    color: white;
    margin: auto;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    width: 60%;
    .yellow {
      color: rgb(236, 255, 114);
    }
    .red {
      color: #fe5d5d;
    }
  }
}
</style>
