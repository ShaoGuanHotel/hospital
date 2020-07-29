<template>
  <!-- 一行 -->
  <div class="x-list">
    <div class="x-list-icon">
      <img :src="iconMap[levelId]" alt />
    </div>
    <div class="x-list-label">
      <div>
        <div class="label-type">
          {{ levelName }}
        </div>
        <div class="label-number">{{ patients.length }}人</div>
      </div>
    </div>
    <div class="x-list-split">
      <div class="split-line" :style="{ background: splitColors[colorIndex] }"></div>
    </div>
    <div class="x-list-person" ref="xListPerson">
      <div class="person-one" v-for="(person, pNumber) in patients" :key="person.patientId">
        <div class="center">
          <div>
            <span>{{ pNumber + 1 }}</span>
            <span>{{ person.patientName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { iconMap, splitColors } from '@/constant/xList.js'
import { SCROLL_TIME } from '@/constant/time.js'

export default {
  props: {
    patients: {
      type: Array,
      default() {
        return []
      },
    },
    levelName: {
      type: String,
      default: '军属',
    },
    levelId: {
      type: Number,
      default: 1,
    },
    colorIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      iconMap,
      splitColors,
      timer: -1,
      scrollX: 0,
    }
  },
  computed: {},
  mounted() {
    this.timer = setInterval(() => {
      this.scrollX += 1
      this.$refs.xListPerson.scrollTo(this.scrollX, 0)
    }, SCROLL_TIME)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>
<style lang="less">
.x-list {
  width: 100%;
  height: calc(25% - 0.2rem);
  font-size: 0.3rem;
  background: white;
  margin-bottom: 0.2rem;
  padding-left: 0.6rem;
  position: relative;
  .x-list-icon,
  .x-list-label,
  .x-list-split,
  .x-list-person {
    display: inline-block;
    height: 100%;
  }
  .x-list-icon {
    display: inline-block;
    height: calc(100% + 4px);
    position: absolute;
    left: -57px;
    top: -2px;
    img {
      height: 100%;
    }
  }
  .x-list-label {
    position: absolute;
    margin: 0 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .label-type {
      font-size: 0.4rem;
      color: #00c18c;
    }
    .label-number {
      font-size: 0.26rem;
      font-weight: bold;
      color: #ff7271;
    }
  }
  .x-list-split {
    margin: 0 0.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    left: 3rem;
    .split-line {
      width: 0.08rem;
      height: 70%;
      background: #00c18c;
    }
  }
  .x-list-person {
    width: calc(100% - 3.6rem);
    position: absolute;
    left: 3.6rem;
    white-space: nowrap;
    overflow: hidden;
    .person-one {
      display: inline-block;
      height: 100%;
      width: 2rem;
      font-size: 0.36rem;
    }
  }
}
</style>
