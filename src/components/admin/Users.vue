<!-- adminUserlist -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>组织管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="selectUserId" placeholder="请输入用户id" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="selectUserName" placeholder="请输入用户名称" clearable></el-input>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入用户昵称" v-model="selectNickName" clearable>
            <el-button slot="append" icon="el-icon-search" @click="selectUser"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 全局按钮 -->
      <div class="grid-content bg-purple" style="margin-top : 15px">
        <el-button
          @click="addDialogVisible = true"
          type="warning"
          plain
          icon="el-icon-circle-plus-outline"
        >添加用户</el-button>
        <el-button
          @click="deleteUsersMessage"
          type="danger"
          plain
          icon="el-icon-delete-solid"
        >批量删除用户</el-button>
      </div>
      <!-- 用户列表区域 -->
      <el-table
        :data="userlist"
        border
        stripe
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <!-- <el-table-column prop="id" label="id" sortable></el-table-column> -->
        <el-table-column prop="username" label="用户名" width="80px"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="80px"></el-table-column>
        <el-table-column prop="nickName" label="昵称" width="100px"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column label="性别" width="45px">
          <template v-slot="scope">
            <a v-if="scope.row.sex === 1">男</a>
            <p v-else>女</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="email" label="邮箱"></el-table-column> -->
        <el-table-column prop="deptName" label="部门" sortable></el-table-column>
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
        <el-table-column label="状态" width="50px">
          <template v-slot="scope">
            <a v-if="scope.row.status === 1">正常</a>
            <p v-else style="color:#F56C6C">封禁</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <!-- 修改资料按钮 -->
            <el-tooltip effect="dark" content="修改资料" placement="top" :enterable="false">
              <el-button
                type="info"
                icon="el-icon-user"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 修改密码按钮 -->
            <el-tooltip effect="dark" content="修改密码" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showPwd(scope.row.id,scope.row.username)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-button
              v-if="scope.row.status === 1"
              type="danger"
              plain
              size="mini"
              @click="statusById(scope.row.id,scope.row.status)"
            >封禁</el-button>
            <el-button
              v-else
              type="success"
              plain
              size="mini"
              @click="statusById(scope.row.id,scope.row.status)"
            >解禁</el-button>
          </template>
        </el-table-column>
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

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码的对话框 -->
    <el-dialog title="修改密码" :visible.sync="pwdDialogVisible" width="50%" @close="pwdDialogClosed">
      <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="80px">
        <el-form-item label="用户id">
          <el-input v-model="pwdForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="pwdNameText" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" show-password>
          <el-input v-model="pwdForm.newPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pwdUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="75%">
      <template>
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="roleModel"
            filterable
            :props="{key: 'id',label: 'name'}"
            :titles="['未选择角色', '已选择角色']"
            @change="handleChange"
            :data="roleData"
          ></el-transfer>
        </div>
        <div style="text-align: center">
          <el-button @click="setRoleDialogVisible=false">取 消</el-button>
          <el-button info="primary" @click="setRoleAjax">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 回到顶部 -->
    <!-- <template>
      <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
    </template>-->
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表值
      queryInfo: {
        endTime: '',
        nickName: '',
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        status: '',
        userId: '',
        username: ''
      },
      userlist: [],
      total: 0,
      selectUserId: '',
      selectUserName: '',
      selectNickName: '',
      // 控制 添加用户对话框 的显示与隐藏
      addDialogVisible: false,
      // 控制 修改用户对话框 的显示与隐藏
      editDialogVisible: false,
      pwdDialogVisible: false,
      setRoleDialogVisible: false,
      // 分配角色框model
      roleModel: [],
      roleData: [],
      roleUserId: '',
      // 添加用户的表单数据
      addForm: {
        createWhere: 1,
        deptId: '',
        password: '',
        phone: '',
        status: 1,
        username: ''
      },
      // 添加用户表单的验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名的长度在3~12个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户的表单数据
      editForm: {
        deptId: '',
        email: '',
        id: '',
        nickName: '',
        phone: '',
        realName: '',
        status: 1,
        username: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '昵称的长度在1~15个字符之间',
            trigger: 'blur'
          }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '真实姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      pwdForm: { id: '', newPwd: '' },
      pwdNameText: '',
      pwdFormRules: {
        newPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 批量删除列表
      deleteUserList: [],
      // 多选的数据
      multipleSelection: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post('users', this.queryInfo)
      if (res.code !== 0) return this.$message.error('查询失误！' + res.msg)
      this.userlist = res.data.list
      this.total = res.data.totalRows
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    // 分配角色
    async setRole(id) {
      const { data: res } = await this.$http.get('user/roles/' + id)
       if (res.code !== 0)return  this.$message.error('删除失败!' + res.msg)
      this.roleData = res.data.allRole
      this.roleModel = res.data.ownRoles
      this.roleUserId = id
      this.setRoleDialogVisible = true
    },
    async setRoleAjax() {
      const { data: res } = await this.$http.post('user/role',{
        roleIds:this.roleModel,
        userId:this.roleUserId
      })
       if (res.code === 0) {
        this.$message.success('分配角色成功!')
        this.setRoleDialogVisible =false;
      } else this.$message.error('操作失败!' + res.msg)
    },
    // 监听pageSize
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    // 查询users
    selectUser() {
      this.queryInfo.userId = this.selectUserId
      this.queryInfo.username = this.selectUserName
      this.queryInfo.nickName = this.selectNickName
      this.getUserList()
      this.selectUserId = this.selectUserName = this.selectNickName = ''
    },
    // 展示修改对话框
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm = row
      // this.editForm.username = row.username
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('user', this.editForm)
        if (res.code === 0) {
          this.$message.success('修改信息成功!')
          this.editDialogClosed()
          this.editDialogVisible = false
        } else this.$message.error('操作失败!' + res.msg)
      })
    },
    // 删除单个用户
    async removeUserDetail(userId) {
      const { data: res } = await this.$http.delete('user', {
        data: { list: [userId] }
      })
      if (res.code === 0) {
        this.$message.success('删除成功!')
        this.getUserList()
      } else this.$message.error('删除失败!' + res.msg)
    },
    // 根据id删除对应的id--->对话框
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将 删除 该用户, 是否继续?',
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
      this.removeUserDetail(id)
    },
    // 批量删除
    async deleteUsersMessage() {
      const length = this.multipleSelection.length
      if (length === 0) return this.$message.info('未选中用户')
      var msg = ''
      for (let i = 0; i < length; i++) {
        this.deleteUserList.push(this.multipleSelection[i].id)
        msg += this.multipleSelection[i].username + ', '
      }
      const confirmResult = await this.$confirm(
        '此操作将删除选中的用户 ' + msg + '是否继续?',
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
      const { data: res } = await this.$http.delete('user', {
        data: { list: this.deleteUserList }
      })
      if (res.code === 0) {
        this.$message.success('删除成功!')
        this.getUserList()
      } else this.$message.error('删除失败!' + res.msg)
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮校验
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('user', this.addForm)
        if (res.code === 0) {
          this.$message.success('添加用户成功!')
          this.getUserList()
          this.addDialogClosed()
        } else this.$message.error('添加用户失败' + res.msg)
      })
    },
    // 修改密码框弹出
    showPwd(id, username) {
      this.pwdDialogVisible = true
      this.pwdForm.id = id
      this.pwdNameText = username
    },
    // 监听修改密码框关闭
    pwdDialogClosed() {
      this.pwdNameText = ''
      this.$refs.pwdFormRef.resetFields()
    },
    // 修改密码-->具体操作
    pwdUserInfo() {
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('user/pwd', this.pwdForm)
        if (res.code === 0) {
          this.$message.success('修改密码成功!')
          this.pwdDialogVisible = false
          this.pwdDialogClosed()
        } else this.$message.error('操作失败!' + res.msg)
      })
    },
    // 封禁/解禁
    async statusById(userid, status) {
      var msg = ''
      var newStatus = status == 1 ? 2 : 1
      if (status === 1) {
        msg = '是否封禁该用户?'
      } else {
        msg = '是否解禁该用户?'
      }
      console.log(newStatus)

      const confirmResult = await this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'primary'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      const { data: res } = await this.$http.put('user/status', {
        id: userid,
        status: newStatus
      })
      if (res.code === 0) {
        this.$message.success('操作成功!')
        this.getUserList()
      } else this.$message.error('操作失败!' + res.msg)
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang='less' scoped>
</style>