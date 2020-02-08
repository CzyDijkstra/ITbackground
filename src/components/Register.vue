<template>
  <div class="register_container">
    <div class="register_box">
      <!-- logo区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt srcset />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="0px"
        class="register_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            prefix-icon="iconfont icon-user"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="registerForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 重复密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请在此输入密码"
            v-model="newPassword"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item prop="nickName">
          <el-input v-model="registerForm.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <!-- 真实姓名 -->
        <el-form-item prop="realName">
          <el-input v-model="registerForm.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn_s">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="warning" @click="toIndex">回到首页</el-button>
          <el-button type="info" @click="resetregisterForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPassword: '',
      // 注册表单
      registerForm: {
        username: '',
        password: '',
        realName: '',
        nickName: '',
        email: '',
        phone: '',
        createWhere: '1', // PC端注册
        status: 1
      },
      // 这是表单的验证规则对象
      registerRules: {
        username: [
          { required: true, message: '请输入您的账号', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '格式不对', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$notify.success('欢迎您注册琢玉教育账号!')
  },
  methods: {
    // 重置注册表单
    resetregisterForm() {
      this.$refs.registerFormRef.resetFields()
    },
    // 跳转首页界面，暂时无效果
    toIndex() {
      this.$router.push('/index')
    },
    register() {
      if (this.newPassword !== this.registerForm.password) {
        this.newPassword = this.registerForm.password = ''
        return this.$message.danger('二次密码不相同')
      }
      this.$refs.registerFormRef.validate(async valid => {
        // eslint-disable-next-line semi
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/user/register',
          this.registerForm
        )
        // const { data: res } = await this.$http.post('register', this.registerForm)
        console.log(res)
        if (res.code !== 0) {
          this.newPassword = this.registerForm.password = ''
          return this.$message.error('注册失败' + res.msg)
        } else {
          this.$message.success('注册成功!')
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.register_container {
  background: #2b4b6b;
  height: 100%;
}
.register_box {
  width: 450px;
  height: 600px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  background: #2b4b6b;
  border: 1px solid #eee;
  border-radius: 530%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}
.register_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn_s {
  display: flex;
  justify-content: flex-end;
}
</style>
