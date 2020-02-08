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

        <template>
          <div class="jc-component__range">
            <div class="jc-range" :class="rangeStatus?'success':''">
              <i @mousedown="rangeMove" :class="rangeStatus?successIcon:startIcon"></i>
              {{rangeStatus?successText:startText}}
            </div>
          </div>
        </template>

        <!-- 按钮 -->
        <el-form-item class="btn_s">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.isLogined()
  },
  props: {
    //成功图标
    successIcon: {
      type: String,
      default: 'el-icon-success'
    },
    //成功文字
    successText: {
      type: String,
      default: '验证成功'
    },
    //开始的图标
    startIcon: {
      type: String,
      default: 'el-icon-d-arrow-right'
    },
    //开始的文字
    startText: {
      type: String,
      default: '拖动滑块到最右边'
    },
    //或者用值来进行监听
    status: {
      type: String
    }
  },
  data() {
    return {
      disX: 0,
      rangeStatus: false,
      // 登录表单
      loginForm: {
        username: '',
        password: '',
        type: '1' // PC端登录
      },
      canLogin: false,
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
    //滑块移动
    rangeMove(e) {
      let ele = e.target
      let startX = e.clientX
      let eleWidth = ele.offsetWidth
      let parentWidth = ele.parentElement.offsetWidth
      let MaxX = parentWidth - eleWidth
      if (this.rangeStatus) {
        //不运行
        return false
      }
      document.onmousemove = e => {
        let endX = e.clientX
        this.disX = endX - startX
        if (this.disX <= 0) {
          this.disX = 0
        }
        if (this.disX >= MaxX - eleWidth) {
          //减去滑块的宽度,体验效果更好
          this.disX = MaxX
        }
        ele.style.transition = '.1s all'
        ele.style.transform = 'translateX(' + this.disX + 'px)'
        e.preventDefault()
      }
      document.onmouseup = () => {
        if (this.disX !== MaxX) {
          ele.style.transition = '.5s all'
          ele.style.transform = 'translateX(0)'
          //执行成功的函数
          this.errorFun && this.errorFun()
        } else {
          this.rangeStatus = true
          if (this.status) {
            this.$parent[this.status] = true
          }
          //执行成功的函数
          this.successFun && this.successFun()
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    //失败之后的函数
    errorFun() {
      this.canLogin = false
      this.$message.error('验证失败.请刷新网站重尝试')
    },
    // 成功之后的函数
    successFun() {
      this.canLogin = true
    },
    // 重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 跳转注册界面
    register() {
      this.$router.push('/register')
    },
    login() {
      
      this.$refs.loginFormRef.validate(async valid => {
        // eslint-disable-next-line semi
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.code !== 0) {
          this.loginForm.password = ''
          if (res.code === 4000004) {
            return this.$message.error('登录失败，账号密码不匹配')
          }
          return this.$message.error('登陆失败'+res.msg)
        } else {
          this.$message.success('登陆成功!')
          window.localStorage.setItem('accessToken', res.data.accessToken)
          window.localStorage.setItem('refreshToken', res.data.refreshToken)
          window.localStorage.setItem('username', res.data.username)
          window.localStorage.setItem('id', res.data.id)
          window.localStorage.setItem('phone', res.data.phone)
          this.$router.push('/index')
        }
      })
    },
    async isLogined() {
      if (window.localStorage.getItem('accessToken') !== null) {
        const { data: res } = await this.$http.get('/user/token')
        if (res.code === 0) this.$router.push('/adminhome')
        else {
          window.localStorage.removeItem('accessToken')
          window.localStorage.removeItem('refreshToken')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.jc-range {
  background-color: rgb(149, 176, 233);
  position: relative;
  transition: 1s all;
  user-select: none;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px; /*no*/
}
.jc-range i {
  position: absolute;
  left: 0;
  width: 60px; /*no*/
  height: 100%;
  color: #979fe4;
  background-color: #fff;
  border: 1px solid #bbb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.jc-range.success {
  background-color: #7ac23c;
  color: #fff;
}
.jc-range.success i {
  color: #7ac23c;
}

.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 330px;
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
