<template>
  <div class="room">
    <div class="holl-content">
      <my-header :heightStyle="{ height: '1.2rem' }" />
      <div class="holl-mid">
        <div class="holl-room">
          <notice />
          <div class="rooms">
            <y-list v-for="(room, index) in currentData" :key="`${keyBase}_${index}`" v-bind="room"></y-list>
          </div>
        </div>
        <my-bottom />
      </div>
    </div>
  </div>
</template>
<script>
// 大厅
import chunk from 'lodash/chunk'
import { CHANGE_TIME } from '@/constant/time.js'

import yList from '@/components/yList'
import myHeader from '@/components/header'
import myBottom from '@/components/bottom'
import notice from '@/components/notice'
export default {
  components: {
    yList,
    myBottom,
    myHeader,
    notice,
  },
  data() {
    return {
      chunkData: [],
      pageNumber: 0, // 0 和 1切换
      keyBase: Math.random(),
    }
  },
  activated() {
    this.keyBase = Math.random()
    this.pageNumber = 0
    this.initData()
  },
  created() {
    this.initData()
  },
  computed: {
    currentData() {
      return this.chunkData[this.pageNumber]
    },
  },
  methods: {
    async initData() {
      this.pageNumber = 0
      const data = await this.$api.getRooms()
      this.chunkData = chunk(data.rooms, 3)

      // setTimeout(() => {
      //   this.pageNumber = 1
      //   setTimeout(() => {
      //     // this.$store.commit('changePath', 'Holl')
      //   }, CHANGE_TIME)
      // }, CHANGE_TIME)
    },
  },
  beforeDestroy() {},
}
</script>
<style lang="less">
.room {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .holl-content {
    width: 100%;
    height: 100%;
    .holl-mid {
      height: calc(100% - 2rem);
      .holl-room {
        height: 100%;
        .rooms {
          height: calc(100% - 0.8rem);
          width: calc(100% - 1.7rem);
          margin-left: 0.8rem;
        }
      }
    }
  }
}
</style>
