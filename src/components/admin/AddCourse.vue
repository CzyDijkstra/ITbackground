<!--  -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>增加课程</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form :model="addlist">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="addlist.name"></el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input type="textarea" autosize v-model="addlist.description"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="span">
          <el-input v-model="addlist.span"></el-input>
        </el-form-item>
        <el-form-item label="推荐指数" prop="hot">
          <el-input v-model="addlist.hot" placeholder="0为默认，1为推荐，2为热门"></el-input>
        </el-form-item>
        <el-form-item label="课程内容">
          <br />
          <div>
            <editor-bar v-model="addlist.content" :isClear="isClear" @change="change"></editor-bar>
          </div>
        </el-form-item>
        <el-form-item label="示例代码">
          <br />
          <div>
            <editor-bar v-model="addlist.simplecode" :isClear="isClear" @change="change_2"></editor-bar>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitCourse">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import EditorBar from '@/components/wangEnduit/editoritem'

export default {
  components: { EditorBar },
  data() {
    return {
      isClear: false,
      content: '',
      addlist: {
        content: '',
        description: '',
        hot: 0,
        name: '',
        ordernum: 50,
        simplecode: '',
        span: '',
        status: 1,
        teacherId: ''
      }
    }
  },
  methods: {
    change_2(val) {
      // console.log('code: ' + val)
      this.addlist.simplecode = val
    },
    change(val) {
      // console.log('内容:' + val)
      this.addlist.content = val
    },
    async submitCourse() {
      const confirmResult = await this.$confirm('是否提交表单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消提交')
      }
      const { data: res } = await this.$http.post('/course', this.addlist)
      console.log(res)
      if (res.code === 0) {
        this.$message.success('提交成功')
        this.$router.push('/admin/course')
      } else return this.$message.danger('提交失败，' + res.msg)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>