import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
import store from '@/store'
import { Message } from "element-ui";
import { title } from "@/settings";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    meta:{auth:1},
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    meta:{auth:1},
    component: () => import("@/views/404"),
    hidden: true,
  },

  // 首页
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    meta:{auth:1},
    children: [
      {
        path: "dashboard",
        name: "首页",
        // component: () => import("@/views/dashboard/index"),
        components:{
          default:()=> import("@/views/dashboard/index"),
          content:()=> import("@/views/dashboard/index"),
        },
        meta: { title: "首页", icon: "dashboard"},
      },
    ],
  },

  //学校管理
  {
    path: "/school",
    component: Layout,
    meta:{auth:3},
    children: [
      {
          path:"",
          name:"School",
          component:()=>import('@/views/activity/school'),
          meta:{title:"学校管理",icon:"school"},
        },{
          path:"add/:schoolId?",
          name:"SchoolAdd",
          component:()=>import("@/views/activity/school/add"),
          meta:{title:"新增或修改学校"},
          hidden:true,
        }]
  },

  //账号管理
  {
    path: "/account",
    component: Layout,
    meta:{auth:2},
    children: [
      {
        path: "",
        name: "Account",
        component: () => import("@/views/activity/account"),
        meta: { title: "账号管理" , icon:'account'},
      },{
        path:"add/:userId?",
        name:"AccountAdd",
        component:()=>import("@/views/activity/account/add"),
        meta:{title:"新增或修改账户"},
        hidden:true,
      }
    ],
  },

  //班级管理
  {
    path:"/myClass",
    component: Layout,
    meta:{auth:2},
    children: [
      {
        path:"",
        name:"MyClass",
        component:()=>import("@/views/activity/myClass"),
        meta:{title:'班级管理',icon:"myClass"}
      }
    ]
  },

  //设备管理
  {
    path:"/device",
    component: Layout,
    meta:{auth:2},
    children:[
      {
        path:"",
        name:"Device",
        component:()=>import("@/views/activity/device"),
        meta:{title:'设备管理',icon:'device'}
      }
    ]
  },

  //学生管理
  {
    path:"/student",
    component: Layout,
    meta:{auth:1},
    children:[
      {
        path:"",
        name:"Student",
        component:()=>import("@/views/activity/student"),
        meta:{title:'学生管理',icon:'student'}
      },{
        path:"add/:studentId?",
        name:"StudentAdd",
        component:()=>import("@/views/activity/student/add"),
        meta:{title:"新增或修改学生"},
        hidden:true,
      }
    ]
  },

  //结果管理
  {
    path:"/result",
    component: Layout,
    meta:{auth:1},
    children:[
      {
        path:"",
        name:"Result",
        component:()=>import("@/views/activity/result"),
        meta:{title:'检测结果管理',icon:'result'}
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true ,meta:{auth:1}},
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

router.beforeEach((to,from,next)=>{
  const userAuth= store.getters.auth;
  if(to.name=='Account'||to.name=='AccountAdd'){
    if(userAuth == 3){
      Message.error('没有权限');
      next("/dashboard");
    }
    else{
      next();
    }
  }
  else if(to.name=='School'||to.name=='SchoolAdd'){
    if(userAuth!=1){
      Message.error('没有权限');
      next("/dashboard");
    }
    else{
      next();
    }
  }

  else if(to.name=='MyClass'){
    if(userAuth==3){
      Message.error('没有权限');
      next("/dashboard");
    }
    else{
      next();
    }
  }

  else if(to.name=='Device'){
    if(userAuth==3){
      Message.error('没有权限');
      next("/dashboard");
    }
    else{
      next();
    }
  }
  
  else{
    next();
  }
})

export default router;
