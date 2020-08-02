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
          height: '1rem',
        }
      },
    },
    name: {
      type: String,
      default: '急诊诊室',
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
  height: 1rem;
  margin-top: 0.2rem;
  display: flex;
  position: relative;
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
    width: 2.5rem;
    margin-top: -0.2rem;
    img {
      height: 1rem;
    }
    .trangle {
      width: 0;
      height: 0;
      border-left: 0.62rem solid transparent;
      border-right: 0.62rem solid transparent;
      border-top: 0.16rem solid white;
    }
  }
  .title {
    text-align: center;
    font-size: 0.5rem;
    position: relative;
    color: white;
    .line {
      border-bottom: 0.04rem solid white;
      width: 1rem;
      display: inline-block;
    }
  }
  .time {
    float: right;
    width: 2.5rem;
    .time-icon {
      font-size: 0.5rem !important;
    }
    .time-container {
      width: calc(100% - 0.56rem) !important;
      .date {
        font-size: 0.24rem !important;
      }
      .day-hour {
        font-size: 0.32rem !important;
      }
    }
  }
}
</style>
