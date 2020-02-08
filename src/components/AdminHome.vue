<!--  -->
<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <!-- <img src="~@/assets/logo.png" alt="" srcset=""> -->
        <span>琢玉教育后台管理系统</span>
      </div>
      <div>
      <el-button @click="toBack">回到前台</el-button>
      <el-button @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 菜单区 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="this.$router.path"
        >
          <!-- 1级菜单 -->
          <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
            <!-- 1级菜单模板区域 -->
            <template slot="title">
              <i class="el-icon-s-grid"></i>
              <!-- 文本 -->
              <span>{{item.title}}</span>
            </template>
            <!-- 2级菜单 -->
            <el-menu-item :index="subItem.url" v-for="subItem in item.children" :key="subItem.id">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.title}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getUserMenuList()
  },
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      isCollapse: false
    }
  },
  methods: {
    toBack() {
      this.$router.push('/index')
    },
    async logout() {
      const { data: res } = await this.$http.get('user/logout')
      // console.log(res);
      this.$message.info('正在退出登录')
      this.$router.push('/login')
      if (res.code === 0) this.$message.success('退出登录成功，正在转向首页')
      window.localStorage.clear()
    },
    // 获取所有的菜单和用户信息
    async getUserMenuList() {
      const { data: res } = await this.$http.get('/admin/home')
      if (res.code !== 0) {
        return this.$message.error('初始化失败 : ' + res.msg)
      }
      this.menulist = res.data.menus
      // console.log(res);
    },
    // 点击侧边栏展开或折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang='less' scoped>
.home-container {
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

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
