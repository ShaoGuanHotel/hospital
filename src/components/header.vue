<template>
  <div class="holl-top" :style="heightStyle">
    <div class="icon">
      <img src="static/imgs/logo.jpg" alt />
      <div class="trangle"></div>
    </div>
    <div class="title">
      <span class="line"></span>
      <span>{{ name }}</span>
      <span class="line"></span>
      <div class="emegency-room" v-if="isHadEmegency">
        <div class="left-trangle"></div>
        <span>Emergency Room</span>
        <div class="right-trangle"></div>
      </div>
    </div>
    <div class="time">
      <ht-time />
    </div>
  </div>
</template>
<script>
import HtTime from '@/components/time'

export default {
  props: {
    heightStyle: {
      type: Object,
      default() {
        return {
          height: '1.6rem',
        }
      },
    },
    name: {
      type: String,
      default: '急诊诊室',
    },
    isHadEmegency: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    HtTime,
  },
  data() {
    return {}
  },
  created() {},
}
</script>
<style lang="less">
.holl-top {
  width: 100%;
  height: 1.6rem;
  display: flex;
  justify-content: space-between;
  .icon,
  .title,
  .time {
    height: 100%;
    line-height: 1rem;
    display: inline-block;
  }
  .icon {
    float: left;
    width: 3rem;
    img {
      height: 1.2rem;
    }
    .trangle {
      width: 0;
      height: 0;
      border-left: 0.75rem solid transparent;
      border-right: 0.75rem solid transparent;
      border-top: 0.16rem solid white;
    }
  }
  .title {
    text-align: center;
    font-size: 0.56rem;
    position: relative;
    color: white;
    .line {
      border-bottom: 0.06rem solid white;
      width: 3.14rem;
      display: inline-block;
    }
    .emegency-room {
      position: absolute;
      background: rgb(255, 114, 113);
      font-size: 0.24rem;
      line-height: 0.3rem;
      left: 50%;
      top: 0.85rem;
      height: 0.34rem;
      transform: translateX(-50%);
      .right-trangle {
        width: 0;
        height: 0;
        position: absolute;
        right: -0.1rem;
        top: 0;
        border-top: 0.34rem solid rgb(255, 114, 113);
        border-right: 0.1rem solid transparent;
      }
      .left-trangle {
        width: 0;
        height: 0;
        position: absolute;
        left: -0.1rem;
        top: 0;
        border-bottom: 0.34rem solid rgb(255, 114, 113);
        border-left: 0.1rem solid transparent;
      }
    }
  }
  .time {
    float: right;
    width: 3rem;
  }
}
</style>
