<!-- courlist -->
<template>
  <div>
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
      <el-card>
        <div>
          <el-button type="danger" @click="removeCourses">批量删除</el-button>
        </div>
        <!-- 课程列表 -->
        <el-table :data="courselist" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="标签" width="80px">
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
          
          <el-table-column label="排序码" width="100px">
            <template v-slot="scope">
              <p>{{scope.row.ordernum}}</p>
            </template>
          </el-table-column> 
          <el-table-column label="创建时间" width="150px">
            <template v-slot="scope">
              <p>{{formatDate(scope.row.createTime)}}</p>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="150px">
            <template v-slot="scope">
              <p>{{formatDate(scope.row.updateTime)}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template v-slot="scope">
              <!-- 修改资料按钮 -->
              <el-tooltip effect="dark" content="修改课程详情" placement="top" :enterable="false">
                <el-button
                  type="info"
                  icon="el-icon-edit"
                  size="mini"
                  @click="toUpdate(scope.row.id)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
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
      },

      // 多选的数据
      multipleSelection: [],
      deleteList: []
    }
  },
  created() {
    this.getCoursesList()
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
    },
    toUpdate(id) {
      this.$router.push({ path: '/updatecourse', query: { courseId: id } })
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除
    async removeCourses() {
      const length = this.multipleSelection.length
      if (length === 0) return this.$message.info('未选中用户')
      var msg = ''
      for (let i = 0; i < length; i++) {
        this.deleteList.push(this.multipleSelection[i].id)
        msg += this.multipleSelection[i].username + ', '
      }
      const confirmResult = await this.$confirm(
        '是否删除选中的课程？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      console.log(this.addlist)

      const { data: res } = await this.$http.delete('/course', {
        data: { list: this.deleteList }
      })
      if (res.code === 0) {
        this.$message.success('删除成功')
        this.getCoursesList()
      } else return this.$message.danger('删除失败，' + res.msg)
    }
  }
}
</script>
<style lang='less' scoped>
</style>