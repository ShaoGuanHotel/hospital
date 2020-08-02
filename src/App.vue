<template>
  <div id="app">
    <!-- <Top ref="Top" /> -->
    <div class="mid-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Top from '@/views/Top.vue'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    Top,
  },
  data() {
    return {}
  },
  computed: mapState(['path']),
  created() {
  },
  methods: {},
  beforeDestroy() {},
  watch: {
    path(val) {
      // this.$router.push(val)
    },
  },
}
</script>

<style>
#app {
  height: 100%;
  font-family: 'Microsoft Yahei', sans-serif;
  background-image: linear-gradient(to right, #00c18c 0%, #40c286 57%, #edfd92 100%);
}
.mid-content {
  width: 100%;
  /* height: calc(100% - 60px); */
  overflow: hidden;
  height: 100%;
}
</style>
