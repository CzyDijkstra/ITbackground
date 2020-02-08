<!-- adminDeptlist -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>组织管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 全局按钮 -->
      <div class="grid-content bg-purple" style="margin-top : 15px">
        <el-button @click="addDept" type="warning" plain icon="el-icon-circle-plus-outline">添加部门</el-button>
      </div>

      <!-- 菜单列表区域 -->
      <el-table
        :data="deptslist"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children'}"
      >
        <el-table-column prop="title" label="部门名称"></el-table-column>
        <el-table-column prop="id" label="部门id"></el-table-column>
        <el-table-column prop="deptNo" label="部门编码"></el-table-column>
        <el-table-column prop="managerName" label="部门经理" width="80px"></el-table-column>
        <!-- <el-table-column prop="phone" label="部门电话"></el-table-column> -->
        <el-table-column prop="pid" label="父级部门编码"></el-table-column>
        <el-table-column prop="relationCode" label="层级关系编码"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 列表按钮 -->
          <template v-slot="scope">
            <!-- 修改部门资料按钮 -->
            <el-tooltip effect="dark" content="编辑部门信息" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-edit" size="mini" @click="editDept(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除部门 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteDept(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增部门对话框 -->
      <el-dialog title="添加部门" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addDeptDetailInfo" :rules="FormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="addDeptDetailInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="部门经理" prop="managerName">
            <el-input v-model="addDeptDetailInfo.managerName"></el-input>
          </el-form-item>
          <el-form-item label="部门电话" prop="phone">
            <el-input v-model="addDeptDetailInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="上级部门(默认 无)">
            <el-tree
              :data="DeptDetailTree"
              :props="defaultProps"
              @node-click="addHandleNodeClick"
              :check-strictly="true"
              ref="addTreeRef"
              show-checkbox
              node-key="id"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDeptInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑部门对话框 -->
      <el-dialog
        title="编辑部门"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editDeptDetailInfo"
          :rules="FormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item label="部门id" prop="id">
            <el-input v-model="editDeptDetailInfo.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="editDeptDetailInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="部门经理" prop="managerName">
            <el-input v-model="editDeptDetailInfo.managerName"></el-input>
          </el-form-item>
          <el-form-item label="部门电话" prop="phone">
            <el-input v-model="editDeptDetailInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="上级部门(默认不变)">
            <el-tree
              :data="DeptDetailTree"
              :props="defaultProps"
              @node-click="editHandleNodeClick"
              show-checkbox
              :check-strictly="true"
              ref="editTreeRef"
              node-key="id"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDeptInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deptslist: [],
      addDialogVisible: false,
      addDeptDetailInfo: {
        managerName: '',
        name: '',
        phone: '',
        pid: '0',
        status: 1
      },
      editDialogVisible: false,
      editDeptDetailInfo: {
        id: '',
        managerName: '',
        name: '',
        phone: '',
        pid: '0',
        status: 1
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      FormRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '角色名称的长度在1~20个字符之间',
            trigger: 'blur'
          }
        ],
        managerName: [
          { required: true, message: '请输入部门经理名称', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '描述的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      DeptDetailTree: []
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    async getDeptList() {
      const { data: res } = await this.$http.get('depts/tree')
      if (res.code !== 0) return this.$message.error('查询失误！' + res.msg)
      this.deptslist = res.data
      console.log(this.deptslist)
    },
    // 部门树单选
    addHandleNodeClick(data, checked, node) {
      if (checked) {
        this.$refs.addTreeRef.setCheckedNodes([data])
      }
    },
    editHandleNodeClick(data, checked, node) {
      if (checked) {
        this.$refs.editTreeRef.setCheckedNodes([data])
      }
    },
    // 删除单个部门
    async deleteDept(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除这一部门! 是否继续?',
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
      const { data: res } = await this.$http.delete('dept/' + id)
      if (res.code === 0) {
        this.$message.success('删除成功!')
        this.getDeptList()
      } else this.$message.error('删除失败!' + res.msg)
    },
    // 打开增加部门对话框
    async addDept() {
      const { data: res } = await this.$http.get('depts/tree')
      if (res.code !== 0)
        return this.$message.error('查询权限列表失败！' + res.msg)
      this.DeptDetailTree = res.data
      //console.log(this.DeptDetailTree)
      this.addDialogVisible = true
    },
    // 监视增加部门对话框关闭
    addDialogClosed() {
      this.addDeptDetailInfo = []
      this.DeptDetailTree = []
      this.$refs.addFormRef.resetFields()
    },
    // 新增部门
    async addDeptInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        var checkedNode = this.$refs.addTreeRef.getCurrentKey()
        if (checkedNode !== null) {
          this.addDeptDetailInfo.pid = checkedNode
        } else this.addDeptDetailInfo.pid = '0'
        this.addDeptDetailInfo.status = 1
        const { data: res } = await this.$http.post(
          'dept',
          this.addDeptDetailInfo
        )
        if (res.code === 0) {
          this.$message.success('添加部门成功!')
          this.getDeptList()
          this.addDialogVisible = false
          this.addDialogClosed()
        } else return this.$message.error('操作失败!' + res.msg)
      })
    },
    // 打开编辑部门对话框
    async editDept(dept) {
      const { data: res } = await this.$http.get('depts/tree')
      if (res.code !== 0)
        return this.$message.error('查询权限列表失败！' + res.msg)
      this.DeptDetailTree = res.data
      this.editDeptDetailInfo.id = dept.id
      this.editDeptDetailInfo.managerName = dept.managerName
      this.editDeptDetailInfo.name = dept.title
      this.editDeptDetailInfo.phone = ''
      this.editDeptDetailInfo.pid = dept.pid
      this.editDialogVisible = true
    },
    // 监视编辑部门对话框关闭
    editDialogClosed() {
      this.editDeptDetailInfo.phone = ''
      this.DeptDetailTree = []
      this.$refs.editFormRef.resetFields()
    },
    // this.$refs.editTreeRef.getCheckedKeys()
    // 编辑部门
    async editDeptInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        var checkedNode = this.$refs.editTreeRef.getCurrentKey()
        if (checkedNode !== null) {
          this.editDeptDetailInfo.pid = checkedNode
        }
        this.editDeptDetailInfo.status = 1
        const { data: res } = await this.$http.put(
          'dept',
          this.editDeptDetailInfo
        )
        if (res.code === 0) {
          this.$message.success('编辑部门成功!')
          this.getDeptList()
          this.editDialogVisible = false
          this.editDialogClosed()
        } else return this.$message.error('操作失败!' + res.msg)
      })
    }
  }
}
</script>
<style lang='less' scoped>
</style>