import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import AdminHome from '../components/AdminHome.vue'
import AdminWelcome from '../components/admin/Welcome.vue'
import AdminCourse from '../components/admin/Course.vue'
import AdminAddCourse from '../components/admin/AddCourse.vue'
import UpdateCourse from '../components/admin/UpdateCourse.vue'
import swagger_ui from '../components/admin/Swagger-ui.vue'
import AdminUsers from '../components/admin/Users.vue'
import AdminRoles from '../components/admin/Roles.vue'
import AdminMenusPermission from '../components/admin/MenusPermission.vue'
import AdminDepartment from '../components/admin/Department.vue'
import AdminLogs from '../components/admin/Log.vue'
import Druid_sql from '../components/admin/Druid-sql.vue'
import UpdatePwd from '../components/admin/UpdatePwd.vue'
import IndexTest from '../components/test/index.vue'
import IndexTemplate from '../components/index/index.vue'
import CourseList from '../components/index/courselist.vue'
import Course from '../components/index/course.vue'
import SelectCourses from '../components/index/select_course.vue'
import Index from '../components/Index.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    redirect: '/indextemplate',
    children: [
      { path: '/indextemplate', name: 'indextemplate', component: IndexTemplate },
      { path: '/indextest', name: 'indextest', component: IndexTest },
      { path: '/courselist', name: 'courselist', component: CourseList },
      { path: '/course', name: 'course', component: Course },
      { path: '/selectcourses', name: 'selectcourses', component: SelectCourses }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/adminhome',
    name: 'adminhome',
    component: AdminHome,
    redirect: '/adminwelcome',
    children: [
      { path: '/adminwelcome', name: 'adminWelcome', component: AdminWelcome },
      { path: '/admin/users', name: 'adminUsers', component: AdminUsers },
      { path: '/admin/roles', name: 'adminRoles', component: AdminRoles },
      { path: '/admin/menus', name: 'adminMenuPermission', component: AdminMenusPermission },
      { path: '/swagger-ui', component: swagger_ui },
      { path: '/admin/depts', name: 'adminDepartment', component: AdminDepartment },
      { path: '/admin/logs', name: 'adminLogs', component: AdminLogs },
      { path: '/druid/sql', component: Druid_sql },
      { path: '/admin/updatepwd', name: 'updatepwd', component: UpdatePwd },
      { path: '/admin/course', component: AdminCourse },     
      { path: '/updatecourse', component: UpdateCourse },
      { path: '/admin/addcourse', component: AdminAddCourse },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/indextest') return next()
  if (to.path === '/course') return next()
  if (to.path === '/selectcourses') return next()
  if (to.path === '/courselist') return next()
  if (to.path === '/indextemplate') return next()
  if (to.path === '/index') return next()
  if (to.path === '/login') return next()
  if (to.path === '/register') return next()
  const accessTokenStr = window.localStorage.getItem('accessToken')
  const refreshTokenStr = window.localStorage.getItem('refreshToken')
  if (!accessTokenStr && !refreshTokenStr) return next('/login')
  next()
})

export default router
