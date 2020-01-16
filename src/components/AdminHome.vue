<!--  -->
<template>

  <el-container class="home-container">
    <!--头部区域-->
  <el-header>
    <div>
      <!-- <img src="~@/assets/logo.png" alt="" srcset=""> -->
      <span>琢玉教育后台管理系统</span>
    </div>
    <el-button type='info' @click="logout">退出</el-button>

  </el-header>
  <!-- 页面主体 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <!-- 菜单区 -->
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b">
      <!-- 1级菜单 -->
      <el-submenu index="1">
        <!-- 1级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>导航一</span>
        </template>
        <!-- 2级菜单 -->
         <el-menu-item index="1-4-1">
           <span>导航一</span>
         </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧主体 -->
    <el-main>Main</el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
  created (){
    this.getUserMenuList()
  },
  data () {
    return {
      // 左侧菜单数据
      menulist: []
    }
  },
  methods: {
    async logout () {
        const {data : res} = await this.$http.get('user/logout')
        // console.log(res);
        this.$message.success('正在退出登录')
        if(res.code === 0) this.$message.success('退出登录成功，正在转向首页')
        window.sessionStorage.clear()
         this.$router.push('/login')
    },
    // 获取所有的菜单和用户信息
    async getUserMenuList(){
      const {data : res} = await this.$http.get('/admin/home')
      if (res.code !== 0) {
        return this.$message.error('初始化失败 : ' + res.msg)
      }
      this.menulist = res.data  
      // console.log(res);
    }
  }
}

</script>
<style lang='less' scoped>
.home-container{
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
