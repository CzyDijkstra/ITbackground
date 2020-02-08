<!-- menus permission -->
<template>
  <div class="wrap">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>组织管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 全局按钮 -->
      <div class="grid-content bg-purple" style="margin-top : 15px">
        <el-button @click="addMenu" type="warning" plain icon="el-icon-circle-plus-outline">添加</el-button>
      </div>
      <!-- 菜单列表区域 -->
      <el-table
        :data="menuslist"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children'}"
      >
        <!-- <el-table-column prop="id" label="id"></el-table-column> -->
        <el-table-column prop="title" label="名称"></el-table-column>
        <el-table-column prop="url" label="url"></el-table-column>
        <el-table-column prop="method" label="请求方式" width="80px"></el-table-column>
        <el-table-column prop="type" label="类型" width="80px">
          <template v-slot="scope">
            <el-tag v-if="scope.row.type===1" type="info">目录</el-tag>
            <el-tag v-else-if="scope.row.type===2" type="warning">菜单</el-tag>
            <el-tag v-else type="success">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pidName" label="父级节点"></el-table-column>
        <el-table-column prop="perms" label="权限代码"></el-table-column>
        <el-table-column prop="code" label="按钮代码"></el-table-column>
        <el-table-column prop="orderNum" label="排序" width="55px"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改资料按钮 -->
            <el-tooltip effect="dark" content="修改菜单权限信息" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-edit" size="mini" @click="editMenu(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除菜单权限按钮 -->
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="deleteMenu(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑权限对话框 -->
      <el-dialog
        title="编辑权限"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :rules="FormRules"
          ref="editFormRef"
          :model="editMenuDetailInfo"
          label-width="80px"
        >
          <el-form-item label="权限id" prop="id">
            <el-input v-model="editMenuDetailInfo.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="editMenuDetailInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="url" prop="url">
            <el-input v-model="editMenuDetailInfo.url"></el-input>
          </el-form-item>
          <el-form-item label="权限类型" prop="type">
            <el-select v-model="addMenuDetailInfo.type">
              <el-option label="目录" value="1"></el-option>
              <el-option label="菜单" value="2"></el-option>
              <el-option label="按钮" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求方式" prop="method">
            <el-select v-model="editMenuDetailInfo.method" placeholder="请选择">
              <el-option label="目录/菜单" value></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="GET" value="GET"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="OPTIONS" value="OPTIONS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序码" prop="orderNum">
            <el-input v-model.number="editMenuDetailInfo.orderNum"></el-input>
          </el-form-item>
          <el-form-item label="权限代码" prop="perms">
            <el-input v-model="editMenuDetailInfo.perms"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单(需要重新选择)">
            <el-tree
              :data="MenuDetailTree"
              :props="defaultProps"
              @node-click="editHandleNodeClick"
              :check-strictly="true"
              ref="editMenuTreeRef"
              show-checkbox
              node-key="id"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editMenuInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新增权限对话框 -->
      <el-dialog title="添加权限" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :rules="FormRules" ref="addFormRef" :model="addMenuDetailInfo" label-width="80px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="addMenuDetailInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="url" prop="url">
            <el-input v-model="addMenuDetailInfo.url"></el-input>
          </el-form-item>
          <el-form-item label="权限类型" prop="type">
            <el-select v-model="addMenuDetailInfo.type">
              <el-option label="目录" value="1"></el-option>
              <el-option label="菜单" value="2"></el-option>
              <el-option label="按钮" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求方式" prop="method">
            <el-select v-model="addMenuDetailInfo.method" placeholder="请选择">
              <el-option label="目录/菜单" value></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="GET" value="GET"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="OPTIONS" value="OPTIONS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按钮代码" prop="code">
            <el-input v-model="addMenuDetailInfo.code"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="orderNum">
            <el-input v-model.number="addMenuDetailInfo.orderNum"></el-input>
          </el-form-item>
          <el-form-item label="权限代码" prop="perms">
            <el-input v-model="addMenuDetailInfo.perms"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单(默认顶级)">
            <el-tree
              :data="addMenuDetailTree"
              :props="defaultProps"
              @node-click="addHandleNodeClick"
              :check-strictly="true"
              ref="addMenuTreeRef"
              show-checkbox
              node-key="id"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMenuInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuslist: [],
      addDialogVisible: false,
      addMenuDetailInfo: {
        code: '',
        method: '',
        name: '',
        orderNum: 100,
        perms: '',
        pid: '0',
        status: 1,
        type: 1,
        url: ''
      },
      editDialogVisible: false,
      editMenuDetailInfo: {
        id: '',
        method: '',
        name: '',
        orderNum: 100,
        perms: '',
        pid: '0',
        status: 1,
        type: 1,
        url: ''
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      FormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '角色名称的长度在1~20个字符之间',
            trigger: 'blur'
          }
        ],
        orderNum: [
          { required: true, message: '请填写', trigger: 'blur' },
          {
            type: 'number',
            min: 0,
            max: 100,
            message: '必须为数字,且在0-100间',
            trigger: 'blur'
          }
        ]
      },
      addMenuDetailTree: [],
      MenuDetailTree: []
    }
  },
  created() {
    this.getMenusList()
  },
  methods: {
    async getMenusList() {
      const { data: res } = await this.$http.get('permissions/tree/detail')
      if (res.code !== 0) return this.$message.error('查询失误！' + res.msg)
      this.menuslist = res.data
    },
    // 新增-菜单权限树单选
    addHandleNodeClick(data, checked, node) {
      if (checked) {
        this.$refs.addMenuTreeRef.setCheckedNodes([data])
      }
    },
    // 打开增加菜单权限对话框
    async addMenu() {
      const { data: res } = await this.$http.get('permission/tree')
      if (res.code !== 0)
        return this.$message.error('查询权限列表失败！' + res.msg)
      this.addMenuDetailTree = res.data
      this.addDialogVisible = true
    },
    // 监视增加菜单权限对话框关闭
    addDialogClosed() {
      this.addMenuDetailInfo.orderNum = this.addMenuDetailInfo.type = 0
      this.addMenuDetailInfo.method = this.addMenuDetailInfo.name = this.addMenuDetailInfo.perms = this.addMenuDetailInfo.pid = this.addMenuDetailInfo.url =
        ''
      this.MenuDetailTree = []
      this.$refs.addFormRef.resetFields()
    },
    // 新增菜单权限
    async addMenuInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        var checkedNode = this.$refs.addMenuTreeRef.getCheckedKeys()
        // console.log(this.$refs.addMenuTreeRef.getCheckedKeys())

        if (checkedNode.length === 1) {
          this.addMenuDetailInfo.pid = checkedNode[0]
        } else if (checkedNode.length === 0) this.addMenuDetailInfo.pid = '0'
        else return this.$message.error('只能选择一个部门')
        this.addMenuDetailInfo.status = 1
        // console.log(this.addMenuDetailInfo.pid)

        const { data: res } = await this.$http.post(
          'permission',
          this.addMenuDetailInfo
        )
        if (res.code === 0) {
          this.$message.success('添加菜单权限成功!')
          this.getMenusList()
          this.addDialogVisible = false
          this.addDialogClosed()
        } else return this.$message.error('操作失败!' + res.msg)
      })
    },

    // 编辑-菜单权限树单选
    editHandleNodeClick(data, checked, node) {
      if (checked) {
        this.$refs.editMenuTreeRef.setCheckedNodes([data])
      }
    },
    // 打开编辑菜单权限对话框
    async editMenu(mres) {
      const { data: res } = await this.$http.get('permission/tree')
      if (res.code !== 0)
        return this.$message.error('查询权限列表失败！' + res.msg)
      this.MenuDetailTree = res.data
      console.log(mres)

      this.editMenuDetailInfo.id = mres.id
      this.editMenuDetailInfo.method = mres.method
      this.editMenuDetailInfo.name = mres.title
      this.editMenuDetailInfo.orderNum = mres.orderNum
      this.editMenuDetailInfo.perms = mres.perms
      this.editMenuDetailInfo.status = mres.status
      this.editMenuDetailInfo.type = mres.type
      this.editMenuDetailInfo.url = mres.url
      //console.log(this.MenuDetailTree)
      console.log(this.editMenuDetailInfo)

      this.editDialogVisible = true
    },
    // 监视编辑菜单权限对话框关闭
    editDialogClosed() {
      this.editMenuDetailInfo.orderNum = this.editMenuDetailInfo.type = 0
      this.editMenuDetailInfo.id = this.editMenuDetailInfo.method = this.editMenuDetailInfo.name = this.editMenuDetailInfo.perms = this.editMenuDetailInfo.pid = this.editMenuDetailInfo.url =
        ''
      this.MenuDetailTree = []
      this.$refs.editFormRef.resetFields()
    },
    // 编辑菜单权限
    async editMenuInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        var editCheckedNode = this.$refs.editMenuTreeRef.getCheckedKeys()
        // console.log(this.$refs.addMenuTreeRef.getCheckedKeys())
        if (editCheckedNode.length === 1) {
          this.editMenuDetailInfo.pid = editCheckedNode[0]
        } else if (checkedNode.length === 0) this.editMenuDetailInfo.pid = '0'
        else return this.$message.error('只能选择一个部门')
        this.editMenuDetailInfo.status = 1
        const { data: res } = await this.$http.put(
          'permission',
          this.editMenuDetailInfo
        )
        if (res.code === 0) {
          this.$message.success('编辑菜单权限成功!')
          this.getMenusList()
          this.editDialogVisible = false
          this.editDialogClosed()
        } else return this.$message.error('操作失败!' + res.msg)
      })
    },
    // deleteMenu
    async deleteMenu(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该菜单/目录/按钮! 是否继续?',
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
      const { data: res } = await this.$http.delete('permission/' + id)
      if (res.code === 0) {
        this.$message.success('删除成功!')
        this.getMenusList()
      } else this.$message.error('删除失败!' + res.msg)
    }
  }
}
</script>
<style lang='less' scoped>
</style>