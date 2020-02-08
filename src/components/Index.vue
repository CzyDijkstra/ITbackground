<!-- index -->
<template>
  <el-container>
    <!-- 顶部导航 -->
    <el-header>
      <div>
        <!-- <img src="~@/assets/logo.png" alt="" srcset=""> -->
        <span>琢玉教育学习平台</span>
        <div class="line"></div>
        <el-menu
          :default-active="this.$router.path"
          router
          mode="horizontal"
          @select="handleSelect"
          background-color="#373333"
          text-color="#fff"
          active-text-color="#f6ca9d"
        >
          <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">{{ item.navItem }}</el-menu-item>
        </el-menu>
      </div>
      <div>
        <span style="font-size:15px" v-if="isLogined === true">欢迎您，{{loginedName}}！</span>
        <el-button style="color=" v-if="isLogined ===true" size="mini" type="text" @click="unLogin">退出登录</el-button>
        <el-button v-if="isLogined === false" size="mini" type="text" @click="toLogin">登录</el-button>
        <el-button
          v-if="isLogined === false"
          size="mini"
          type="text"
          @click="toR"
        >注册</el-button>
      </div>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <el-aside width="220px" id='nav_1' style="min-height:1000px"></el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
      <el-aside width="220px"></el-aside>
    </el-container>
    <el-container>
      <el-footer>
        <div>
          <span>Copyright © 2019-2020 Zhuoyu Chen of Shaoxing University YuanPei College.</span>
        </div>
        <div>
          <el-link icon="el-icon-share" href="http://czy15.cn" target="_blank">友情博客</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link icon="el-icon-star-on" href="https://github.com/CzyDijkstra" target="_blank"></el-link>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isLogined: false,
      loginedName: null,
      activeIndex: '1',
      navList: [
        { name: '/indextemplate', navItem: '首页' },
        { name: '/courselist', navItem: '课程列表' },
        { name: '/selectcourses', navItem: '课程搜索' },
        { name: '/indextest', navItem: '在线编译' },
        { name: '/adminhome', navItem: '后台管理' }
      ]
    }
  },
  created() {
    this.isLoginedmethod()
    console.log(this.isLogined);
    
  },
  methods: {
    isLoginedmethod() {
      if (window.localStorage.getItem('accessToken') !== null) {
        this.isLogined = true
        this.loginedName = window.localStorage.username
      }
    },
    async unLogin() {
      const { data: res } = await this.$http.get('user/logout')
      // console.log(res);
      this.$message.info('正在退出登录')
      this.isLogined=false
      // this.$router.go('/index')
      if (res.code === 0) this.$message.success('退出登录成功，正在转向首页')
      window.localStorage.clear()
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    toLogin(){
      this.$router.push('/login')
    },
    toR(){
      this.$router.push('/register')
    }
  }
}
</script>
<style lang='less' scoped>
.el-header {
  background-color: #373333;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #f6ca9d;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-footer {
  background-color: #373333;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #f6ca9d;
  font-size: 10px;
  > div {
    display: flex;
    align-items: center;
    text-align: center;
    span {
      margin-left: 15px;
    }
  }
}
.el_link {
  font-size: 20px;
}
.el-aside{
  background-color:#eaedf1
}

</style>