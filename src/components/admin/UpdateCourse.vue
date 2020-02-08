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
      <el-form :model="updatelist">
        <el-form-item label="课程id" prop="id">
          <el-input v-model="updatelist.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="updatelist.name"></el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input type="textarea" autosize v-model="updatelist.description"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="span">
          <el-input v-model="updatelist.span"></el-input>
        </el-form-item>
        <el-form-item label="推荐指数" prop="hot">
          <el-input v-model="updatelist.hot" placeholder="0为默认，1为推荐，2为热门"></el-input>
        </el-form-item>
        <el-form-item label="课程内容">
          <br />
          <div>
            <editor-bar v-model="updatelist.content" :isClear="isClear" @change="change"></editor-bar>
          </div>
        </el-form-item>
        <el-form-item label="示例代码">
          <br />
          <div>
            <editor-bar v-model="updatelist.simplecode" :isClear="isClear" @change="change_2"></editor-bar>
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
      updatelist: {
        id: this.$route.query.courseId,
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
  created() {
    this.getCourseInfo(this.$route.query.courseId)
  },
  methods: {
    change_2(val) {
      this.updatelist.simplecode = val
    },
    change(val) {
      this.updatelist.content = val
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
      const { data: res } = await this.$http.put('/course', this.updatelist)
      console.log(res)
      if (res.code === 0) {
        this.$message.success('提交成功')
        this.$router.push('/admin/course')
      } else return this.$message.danger('提交失败，' + res.msg)
    },
    async getCourseInfo(id) {
      const { data: res } = await this.$http.get('course/detail/' + id)
      console.log(res)
      this.updatelist = res.data
    }
  }
}
</script>
<style lang='scss' scoped>
</style>