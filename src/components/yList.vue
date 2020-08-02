<template>
  <div class="y-list">
    <div class="y-list-icon center">
      <div class="img-border">
        <img src="static/imgs/icon_zhen.png" alt />
      </div>
    </div>
    <div class="right center">
      <div>
        <div class="room-name">
          <span>{{ roomName }}</span>
          <span class="number">[{{ `${patients.length}` }}人]</span>
        </div>
        <div class="room-patients" ref="roomPatients">
          <div v-for="person in patients" :key="person.patientId" class="person">
            <div class="person-text">
              <span class="number">{{ person.requestCode }}</span>
              <span>{{ person.patientName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SCROLL_TIME } from '@/constant/time.js'

export default {
  props: {
    patients: {
      type: Array,
      default() {
        return []
      },
    },
    roomName: {
      type: String,
      default: '急诊1诊室',
    },
  },
  data() {
    return {
      timer: -1,
      scrollX: 0,
    }
  },
  computed: {},
  mounted() {
    this.timer = setInterval(() => {
      this.scrollX += 1
      this.$refs.roomPatients.scrollTo(this.scrollX, 0)
    }, SCROLL_TIME)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>
<style lang="less">
.y-list {
  width: 100%;
  height: calc(33% - 0.3rem);
  font-size: 0.3rem;
  background: rgba(255, 255, 255, 0.81);
  margin-top: 0.3rem;
  padding-left: 0.6rem;
  border-radius: 0.3rem;
  position: relative;
  .y-list-icon {
    width: 1.2rem;
    margin-left: -1.2rem;
    .img-border {
      width: 1.2rem;
      height: 1.2rem;

      display: flex;
      justify-content: center;
      align-items: center;

      background: rgb(2, 193, 140);
      border-radius: 50%;
      img {
        width: 1rem;
      }
    }
  }
  .right {
    width: calc(100% - 1.3rem);
    position: absolute;
    top: 0;
    padding-left: 0.4rem;
    .room-name {
      font-size: 0.4rem;
      margin-bottom: 0.05rem;
      color: #3bcc81;
      .number {
        color: #ff7271;
      }
    }
    .room-patients {
      font-size: 0.32rem;
      white-space: nowrap;
      overflow: hidden;
      .person {
        display: inline-block;
        width: 2rem;
        .person-text {
          height: 100%;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          .number {
            display: inline-block;
            width: 0.58rem;
          }
        }
      }
    }
  }
}
</style>
