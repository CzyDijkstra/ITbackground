<!--  -->
<template>
  <div>
    <div class="index_font">
      <a>{{this.courseInfo.name}}</a>
    </div>
    <el-divider content-position="right">创建日期：{{formatDate(this.courseInfo.createTime)}}</el-divider>
    <div>
      <el-tag type="warning">课程内容</el-tag>

      <el-card style="min-height:300px;"  v-loading="loading">
        <p v-html="this.courseInfo.content"></p>
      </el-card>
      <el-row>
        <el-col :span="2" :offset="22">
          <el-button @click="toTest" type="info">试一试</el-button>
        </el-col>
      </el-row>
      <el-tag>样例代码</el-tag>
      <el-card style="min-height:300px;"  v-loading="loading">
        <p v-html="this.courseInfo.simplecode"></p>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: '',
      courseInfo: [],
      loading:true
    }
  },
  created() {
    this.getCourseInfo(this.$route.query.courseId)
  },
  methods: {
    toTest() {
      this.$router.push('/indextest')
    },
    async getCourseInfo(id) {
      const { data: res } = await this.$http.get('course/detail/' + id)
      console.log(res)
      this.courseInfo = res.data
      this.loading=false
    }
  }
}
</script>
<style lang='less' scoped>
.index_font {
  font-size: 40px;
  margin-top: 30px;
  text-align: center;
}

.div_normal {
  margin-top: 30px;
  text-align: center;
}
/* table 样式 */
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}

/* ul ol 样式 */
ul, ol {
  margin: 10px 0 10px 20px;
}
</style>