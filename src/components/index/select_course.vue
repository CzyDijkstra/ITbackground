<!-- courlist -->
<template>
  <div>
    <!-- 版头 广告位-->
    <div class="demo-image__placeholder">
      <div class="block">
        <el-image :src="require('@/assets/image/a.png')"></el-image>
      </div>
    </div>
    <!-- 搜索框体 -->
    <div>
      <el-card style="margin-top:'15px'">
        <span>请输入要搜索的内容</span>

        <el-row style="margin-top:'15px'">
          <el-col :span="8">
            <el-input v-model="queryInfo.courseName" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-date-picker v-model="queryInfo.startTime" type="datetime" placeholder="选择起始日期"></el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="queryInfo.endTime" type="datetime" placeholder="选择结束日期"></el-date-picker>
          </el-col>
          <el-col :span="2" justify="end">
            <el-button @click="getCoursesList" type="primary">查找</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div>
      <!-- 主界面 -->
      <!-- 课程列表 -->
      <el-table :show-header="showheaderboolean" :data="courselist" stripe>
        <el-table-column width="80px">
          <template v-slot="scope">
            <el-tag type="info" effect="plain">{{scope.row.span}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="课程名称">
          <template v-slot="scope">
            <el-tag type="danger" effect="dark" v-if="scope.row.hot == 2" size="mini">热门</el-tag>
            <el-tag type="warning" effect="dark" v-if="scope.row.hot == 1" size="mini">推荐</el-tag>

            <router-link
              style="text-decoration: none;"
              :to="{ path: '/course', query: { courseId: scope.row.id}}"
            >{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="150px">
          <template v-slot="scope">
            <p>{{formatDate(scope.row.createTime)}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-if="ifSelected"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[5, 10, 15, 20,50]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ifSelected: false,
      showheaderboolean: false,
      total: 0,
      courselist: [],
      queryInfo: {
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        status: 1,
        courseId: '',
        courseName: ''
      }
    }
  },
  methods: {
    async getCoursesList() {
      console.log(this.queryInfo)

      const { data: res } = await this.$http.post('/courses', this.queryInfo)
      console.log(res)
      if (res.code === 0) {
        this.courselist = res.data.list
        this.total = res.data.totalRows
        this.ifSelected = true
      } else this.$notify.error(res.msg)
    },
    // 监听pageSize
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getCoursesList()
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getCoursesList()
    }
  }
}
</script>
<style lang='less' scoped>
</style>