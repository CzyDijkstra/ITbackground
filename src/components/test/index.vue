<template>
  <div class="box">
    <edit v-model="code" @running="running"></edit>
    <running :value="code" ref="run"></running>
  </div>
</template>
<script>
import Edit from './edit'
import classinfo from './class'
import Running from './running'
export default {
  name: 'index',
  components: {
    Edit,
    Running
  },
  data() {
    return {
      code: ''
    }
  },
  methods: {
    running() {
      this.$refs.run.reset()
      this.$refs.run.buildDom()
    },
    rundata() {
      //获取输入框内的数据
      var text = document.getElementById('inputdata').value // 先清空iframe
      var iframe = (document.getElementById(
        'iframe1'
      ).contentWindow.document.body.innerText = '') //将输入框内的数据传给iframe
      iframe = document.getElementById('iframe1').contentDocument.write(text)
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  min-width: 1000px;
  overflow: auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
