<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt srcset />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 验证码：暂时不启用 -->
        <el-form-item>
          <el-input
            v-model="loginForm.vcode"
            placeholder="此栏暂时无用"
            prefix-icon="iconfont icon-danju"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn_s">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单
      loginForm: {
        username: '',
        password: '',
        // 验证码 未启用
        vcode: ''
      },
      // 这是表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入您的账号', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // eslint-disable-next-line semi
        if (!valid) return
        const res = await this.$http.post('login', this.loginForm)
        // const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.status !== 200) { return this.$message.error('登陆失败，请检查账号密码') } else this.$message.success('登陆成功!')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 350px;
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
.login_form {
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
