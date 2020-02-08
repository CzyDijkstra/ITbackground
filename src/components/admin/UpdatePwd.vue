<!-- 修改个人密码 -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人资料管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改个人密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        oldPwd: '',
        newPwd: '',
        checkPass: ''
      },
      rules: {
        newPwd: [
          { validator: validatePass, trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(updatePwdForm) {
      this.$refs[updatePwdForm].validate(async valid => {
        if (!valid) return this.$message.info('未通过校验！请检查密码格式!')
        const { data: res } = await this.$http.put('user/mypwd', {
          oldPwd: this.ruleForm.oldPwd,
          newPwd: this.ruleForm.newPwd
        })
        if (res.code === 0) {
          this.$message.success('修改成功')
        } else this.$message.error('修改失败!' + res.msg)
        this.resetForm()
      })
    },
    resetForm() {
      this.ruleForm.oldPwd = this.ruleForm.newPwd = this.ruleForm.checkPass = ''
      this.$refs.ruleFormRef.resetFields()
    }
  }
}
</script>
<style lang='scss' scoped>
</style>