<!-- adminUserlist -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 -->
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入要搜索的内容" v-model="searchInput" class="input-with-select" clearable>
          <el-select v-model="selectItem" slot="prepend" placeholder="请选择">
            <el-option label="用户id" value="1"></el-option>
            <el-option label="用户名" value="2"></el-option>
            <el-option label="接口名称" value="3"></el-option>
            <el-option label="起始时间" value="4"></el-option>
            <el-option label="截止时间" value="5"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="selectLog()"></el-button>
        </el-input>
      </div>
      <!-- 全局按钮 -->
      <div class="grid-content bg-purple" style="margin-top : 15px">
        <el-button @click="deleteLog" type="danger" plain>删除选中的日志</el-button>
      </div>
      <el-table
        :data="loglist"
        border
        stripe
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="id" label="id"></el-table-column> -->
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="userId" label="用户id" sortable></el-table-column>
        <el-table-column prop="username" label="用户名" width="100px"></el-table-column>
        <el-table-column label="创建时间">
          <template v-slot="scope">
            <p>{{formatDate(scope.row.createTime)}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="id"></el-table-column> -->
        <el-table-column prop="ip" label="ip地址" sortable></el-table-column>
        <el-table-column label="请求方法">
          <template v-slot="scope">
            <p>{{methodFilter(scope.row.method)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="接口名称"></el-table-column>
        <el-table-column prop="params" label="参数"></el-table-column>
        <el-table-column prop="time" label="花费时间(s)" width="100px"></el-table-column>
        <!-- <el-table-column label="操作" width="70px">
          <el-button icon="el-icon-delete" size="mini" @click="delLogBtn()" type="danger"></el-button>
        </el-table-column>-->
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        endTime: '',
        operation: '',
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        userId: '',
        username: ''
      },
      loglist: [],
      total: 0,
      deleteList: [],
      searchInput: '',
      selectItem: ''
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    async getLogList() {
      const { data: res } = await this.$http.post('logs', this.queryInfo)
      if (res.code !== 0) return this.$message.error('查询失误！' + res.msg)
      this.loglist = res.data.list
      this.total = res.data.totalRows
      return 'success'
    },
    // 监听pageSize
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getLogList()
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getLogList()
    },
    methodFilter(string) {
      return string.substr(26, string.size)
    },
    // 删除日志
    async deleteLog() {
      const length = this.multipleSelection.length
      if (length === 0) return this.$message.info('未选中日志')
      for (let i = 0; i < length; i++) {
        this.deleteList.push(this.multipleSelection[i].id)
      }
      const confirmResult = await this.$confirm(
        '此操作将永久删除选中的日志! 是否继续?',
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

      const { data: res } = await this.$http.delete('log', {
        data: { list: this.deleteList }
      })
      if (res.code === 0) {
        this.$message.success('删除成功!')
        this.getLogList()
      } else this.$message.error('删除失败!' + res.msg)
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索日志
    async selectLog() {
      this.queryInfo.userId = this.queryInfo.username = this.queryInfo.operation = this.queryInfo.startTime = this.queryInfo.endTime =
        ''
      if (this.searchInput === '') {
        return this.$message.info('请输入要搜索的内容')
      }
      switch (this.selectItem) {
        case '1':
          this.queryInfo.userId = this.searchInput
          break
        case '2':
          this.queryInfo.username = this.searchInput
          break
        case '3':
          this.queryInfo.operation = this.searchInput
          break
        case '4':
          this.queryInfo.startTime = this.searchInput
          break
        case '5':
          this.queryInfo.endTime = this.searchInput
          break
        default:
          this.$message.info('请选择要查询的内容')
          console.log(this.selectItem)
          break
      }
      this.getLogList()

      this.searchInput = ''
    }
  }
}
</script>
<style lang='less' scoped>
</style>