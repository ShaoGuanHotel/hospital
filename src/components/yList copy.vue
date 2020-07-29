<template>
  <!-- 一行 -->
  <div class="y-list">
    <!-- 病人类型 -->
    <div class="y-list-label">
      <span>{{ showLabel }}</span>
    </div>
    <!-- 病人,能左右滚动 -->
    <div class="y-list-content">
      <div v-for="person in persons" :key="person.id" class="person">
        <span>{{ person.name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    persons: {
      type: Array,
      default() {
        return []
      },
    },
    label: {
      type: String,
      default: '类型名称',
    },
  },
  data() {
    return {}
  },
  computed: {
    showLabel() {
      return `${this.label}(${this.persons.length}人)`
    },
  },
  created() {},
}
</script>
<style lang="less">
.y-list {
  width: 100%;
  height: 50%;
  font-size: 0.3rem;
  .y-list-label {
    float: left;
    width: 2.6rem;
    height: 100%;
    text-align: right;
    line-height: 2.9rem;
    span {
      margin-right: 0.2rem;
    }
  }
  .y-list-content {
    width: calc(100% - 2.7rem);
    // white-space: nowrap;
    height: 100%;
    float: right;
    overflow: hidden;
    .person {
      display: inline-block;
      width: 2rem;
      line-height: 0.96rem;
      text-align: center;
    }
  }
}
</style>
