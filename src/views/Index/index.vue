<template>
  <div class="index">
    <div class="link-item"><a @click="goto('Holl')">大厅端</a></div>
    <div class="link-item"><a @click="goto('Nurse')">护士端</a></div>
    <div class="link-item"><a @click="goto('Doctor')">医生端</a></div>
  </div>
</template>

<script>
export default {
  methods: {
    goto(path) {
      this.$router.push(path)
    },
  },
}
</script>

<style lang="less">
.index {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, #00c18c 0%, #40c286 57%, #edfd92 100%);
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .link-item {
    display: flex;
    height: 1rem;
    font-size: 0.3rem;
    color: white;
    .margin-right {
      margin-right: 0.2rem;
    }
    .el-button--primary {
      background-color: #409eff;
      border-color: #409eff;
    }
    a {
      color: white;
    }
    a:hover {
      color: blue;
    }
  }
}
</style>
