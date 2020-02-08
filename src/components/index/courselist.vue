<!-- courlist -->
<template>
  <div>
    <!-- 版头 广告位-->
    <div class="demo-image__placeholder">
      <div class="block">
        <el-image :src="require('@/assets/image/a.png')"></el-image>
      </div>
    </div>
    <div>
      <!-- 主界面 -->
      <!-- 课程列表 -->

      <el-table
        :show-header="showheaderboolean"
        :data="courselist"
        stripe
        align="center"
        v-loading="loading"
      >
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="课程描述">
                <span>{{ scope.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
      loading: true,
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
  created() {
    this.getCoursesList()
  },
  methods: {
    async getCoursesList() {
      const { data: res } = await this.$http.post('/courses', this.queryInfo)
      if (res.code === 0) {
        this.courselist = res.data.list
        this.total = res.data.totalRows
        this.ifSelected = true
      } else this.$notify.error(res.msg)
      this.loading = false
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