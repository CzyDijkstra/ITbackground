<template>
  <div class="edit-box">
    <div class="btn-box">
      <el-button>上一知识点</el-button>
      <el-button>下一知识点</el-button>
    </div>
    <div class="style-box">
    </div>
  </div>
</template>
<script>
export default {
  name: 'classinfo',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentValue: this.value,
      disabled: false
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.edit-box {
  width: 30%;
  height: 100%;
  .style-box {
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    background: rgb(250, 220, 220);
    padding-top: 60px;
    margin-top: -60px;
  }
  .btn-box {
    height: 60px;
    position: relative;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    align-items: center;
    background: #c47676;
  }
}
</style>
