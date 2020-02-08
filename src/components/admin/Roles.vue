<!-- adminUserlist -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>组织管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 全局按钮 -->
      <div class="grid-content bg-purple" style="margin-top : 15px">
        <el-button @click="addRole" type="warning" plain icon="el-icon-circle-plus-outline">添加角色</el-button>
      </div>
      <el-table :data="rolelist" border stripe>
        <!-- <el-table-column prop="id" label="id"></el-table-column> -->
        <el-table-column prop="name" label="角色"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="创建时间">
          <template v-slot="scope">
            <p>{{formatDate(scope.row.createTime)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template v-slot="scope">
            <p>{{formatDate(scope.row.updateTime)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 查看权限列表按钮 -->
          <template v-slot="scope">
            <el-tooltip effect="dark" content="查看权限信息" placement="top" :enterable="false">
              <el-button icon="el-icon-user" size="mini" @click="openDrawer(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 修改资料按钮 -->
            <el-tooltip effect="dark" content="修改角色信息" placement="top" :enterable="false">
              <el-button
                type="info"
                icon="el-icon-edit"
                size="mini"
                @click="editRole(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除角色按钮 -->
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="deleteRole(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 查看详细信息的抽屉 -->
      <el-drawer
        title="角色的权限列表详细信息"
        :visible.sync="drawer"
        :with-header="false"
        @close="DrawerClosed"
        :before-close="handleClose"
      >
        <template>
          <el-alert title="权限列表" type="success" description="默认勾选的就是角色拥有的权限. 请注意,此处的操作不会修改系统中的数据"></el-alert>
        </template>

        <el-tree
          :data="roleDetailInfo.permissionRespNode"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
          ref="eltreeRef"
          show-checkbox
          node-key="id"
          :default-checked-keys="CheckedNodeId"
        ></el-tree>
      </el-drawer>

      <!-- 增加角色的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form
          :model="addRoleDetailInfo"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名" prop="name">
            <el-input v-model="addRoleDetailInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="addRoleDetailInfo.description"></el-input>
          </el-form-item>
          <el-form-item label="权限选择">
            <el-tree
              :data="RoleDetailTree"
              :props="defaultProps"
              @node-click="handleNodeClick"
              ref="addRoleTreeRef"
              show-checkbox
              node-key="id"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改角色信息的对话框 -->
      <el-dialog
        title="修改角色信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="roleDetailInfo"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名" prop="name">
            <el-input v-model="roleDetailInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleDetailInfo.description"></el-input>
          </el-form-item>
          <el-form-item label="权限选择">
            <el-tree
              :data="roleDetailInfo.permissionRespNode"
              :props="defaultProps"
              @node-click="handleNodeClick"
              ref="addRoleTreeRef"
              show-checkbox
              node-key="id"
              :default-checked-keys="CheckedNodeId"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

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
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        status: 1,
        roleId: '',
        roleName: ''
      },
      rolelist: [],
      total: 0,
      drawer: false,
      editDialogVisible: false,
      addDialogVisible: false,
      roleDetailInfo: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 查看时默认打勾的节点
      CheckedNodeId: [],
      editFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '角色名称的长度在1~10个字符之间',
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '描述的长度在2~50个字符之间',
            trigger: 'blur'
          }
        ]
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '角色名称的长度在1~10个字符之间',
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '描述的长度在2~50个字符之间',
            trigger: 'blur'
          }
        ]
      },
      addRoleDetailInfo: {
        status: 1,
        description: '',
        name: ''
      },
      RoleDetailTree: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.post('roles', this.queryInfo)
      if (res.code !== 0) return this.$message.error('查询失误！' + res.msg)
      this.rolelist = res.data.list
      console.log(this.rolelist)

      this.total = res.data.totalRows
    },
    // 监听pageSize
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getRoleList()
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getRoleList()
    },
    openDrawer(id) {
      this.showPermission(id)
      this.drawer = true
    },
    // 查看指定角色的详细权限信息
    async showPermission(id) {
      const { data: res } = await this.$http.get('role/' + id)
      if (res.code !== 0) return this.$message.error('查询失误！' + res.msg)
      this.roleDetailInfo = res.data
      for (
        let index = 0;
        index < this.roleDetailInfo.permissionRespNode.length;
        index++
      ) {
        let element = this.roleDetailInfo.permissionRespNode[index]
        if (element.checked === true) this.CheckedNodeId.push(element.id)
        if (element.children !== null) {
          for (let index2 = 0; index2 < element.children.length; index2++) {
            let i = element.children[index2]
            if (i.checked === true) this.CheckedNodeId.push(i.id)
            if (i.children !== null) {
              for (let index3 = 0; index3 < i.children.length; index3++) {
                let j = i.children[index3]
                if (j.checked === true) this.CheckedNodeId.push(j.id)
              }
            }
          }
        }
      }
    },
    handleNodeClick(data) {},
    // 监听抽屉关闭
    DrawerClosed() {
      this.drawer = false
      this.roleDetailInfo = []
      this.CheckedNodeId = []
      // this.$refs.eltreeRef.resetFields()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 监听编辑框关闭
    editDialogClosed() {
      this.roleDetailInfo = []
      this.CheckedNodeId = []
      this.$refs.editFormRef.resetFields()
    },
    // 编辑结果上传
    editUserInfo() {
      this.CheckedNodeId = this.$refs.addRoleTreeRef.getCheckedKeys()
      // console.log(this.CheckedNodeId);
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('role', {
          id: this.roleDetailInfo.id,
          description: this.roleDetailInfo.description,
          name: this.roleDetailInfo.name,
          status: 1,
          permissions: this.CheckedNodeId
        })
        if (res.code === 0) {
          this.$message.success('修改资料成功!')
          this.editDialogVisible = false
          this.editDialogClosed()
        } else this.$message.error('操作失败!' + res.msg)
      })
    },
    // 编辑框打开
    async editRole(id) {
      const { data: res } = await this.$http.get('role/' + id)
      if (res.code !== 0) return this.$message.error('查询失败！' + res.msg)
      this.roleDetailInfo = res.data
      const length_tree = this.roleDetailInfo.permissionRespNode.length
      // 将本来就被选中的放入list中
      for (let index = 0; index < length_tree; index++) {
        let element = this.roleDetailInfo.permissionRespNode[index]
        if (element.checked === true) this.CheckedNodeId.push(element.id)
        if (element.children !== null) {
          for (let index2 = 0; index2 < element.children.length; index2++) {
            let i = element.children[index2]
            if (i.checked === true) this.CheckedNodeId.push(i.id)
            if (i.children !== null) {
              for (let index3 = 0; index3 < i.children.length; index3++) {
                let j = i.children[index3]
                if (j.checked === true) this.CheckedNodeId.push(j.id)
              }
            }
          }
        }
      }
      this.editDialogVisible = true
    },
    // 打开添加角色框,加载菜单权限树
    async addRole() {
      const { data: res } = await this.$http.get('permission/tree/all')
      if (res.code !== 0)
        return this.$message.error('查询权限列表失败！' + res.msg)
      this.RoleDetailTree = res.data
      // console.log(this.RoleDetailTree)
      this.addDialogVisible = true
    },
    // 添加角色
    async addRoleInfo() {
      this.CheckedNodeId = this.$refs.addRoleTreeRef.getCheckedKeys()
      // console.log(this.CheckedNodeId);
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('role', {
          // id: this.roleDetailInfo.id,
          description: this.addRoleDetailInfo.description,
          name: this.addRoleDetailInfo.name,
          status: 1,
          permissions: this.CheckedNodeId
        })
        if (res.code === 0) {
          this.$message.success('添加角色成功!')
          this.getRoleList()
          this.addDialogVisible = false
          this.addDialogClosed()
        } else return this.$message.error('操作失败!' + res.msg)
      })
    },
    // 监听添加框关闭
    addDialogClosed() {
      this.addRoleDetailInfo = []
      this.CheckedNodeId = []
      this.$refs.addFormRef.resetFields()
    },
    // 删除角色
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色! 是否继续?',
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
      const { data: res } = await this.$http.delete('role/' + id)
      if (res.code === 0) {
        this.$message.success('删除成功!')
        this.getRoleList()
      } else this.$message.error('删除失败!' + res.msg)
    }
  }
}
</script>
<style lang='less' scoped>
.elFormHeight {
  height: 20px;
}
</style>