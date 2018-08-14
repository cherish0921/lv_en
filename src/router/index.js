import Vue from 'vue'
import Router from 'vue-router'

const Mainlayout = () => import('@/components/Mainlayout')
const UserCenterLayout = () => import('@/components/Personnal/UserCenter/Layout')
const AdminLayout = () => import('@/components/Personnal/Admin/Layout')

Vue.use(Router)
let router = new Router({
  base: '/en/',
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {name: 'Index'} //tokensale Index
    }, {
      path: '/Usercenter',
      name: 'Usercenter',
      component: () => import(`@/components/Usercenter`)
    }, {
      path: '/main',
      component: Mainlayout,
      children: [
        {
          path: '/Index',
          name: 'Index',
          component: () => import(`@/components/Index/Index`)
        }, {
          path: '/Borrow',
          name: 'Borrow',
          component: () => import(`@/components/Borrow`)
        }, {
          path: '/Investment',
          name: 'Investment',
          component: () => import(`@/components/Investment`),
          children: [
            {
              path: 'Investmentinfo',
              name: 'Investmentinfo',
              component: () => import(`@/components/Investment/Investmentinfo`)
            }
          ]
        }, {
          path: '/Personnal',
          name: 'Personnal',
          component: () => import(`@/components/Personnal`)
        }
      ]
    }, {
      path: '/Wallet',
      name: 'Wallet',
      component: () => import(`@/components/Personnal/Wallet/Wallet`)
    }, {
      path: '/Deposit',
      name: 'Deposit',
      component: () => import(`@/components/Personnal/Wallet/Deposit`)
    }, {
      path: '/Withdraw',
      name: 'Withdraw',
      component: () => import(`@/components/Personnal/Wallet/Withdraw`)
    }, {
      path: '/Transfer',
      name: 'Transfer',
      component: () => import(`@/components/Personnal/Wallet/Transfer`)
    }, {
      path: '/UserCenterLayout',
      name: 'UserCenterLayout',
      component: UserCenterLayout,
      children: [
        {
          path: '/UserCenterNoBind',
          name: 'UserCenterNoBind',
          component: () => import(`@/components/Personnal/UserCenter/NoBind`)
        },
        {
          path: '/UserCenterSetting',
          name: 'UserCenterSetting',
          component: () => import(`@/components/Personnal/UserCenter/Setting`)
        }
      ]
    }, {
      path: '/BindBlockOrBuild',
      name: 'BindBlockOrBuild',
      component: () => import(`@/components/Personnal/UserCenter/BindOrBuild`)
    }, {
      path: '/AdminLayout',
      name: 'AdminLayout',
      component: AdminLayout,
      children: [
        {
          path: '/ForgetPass',
          name: 'ForgetPass',
          component: () => import(`@/components/Personnal/Admin/ForgetPass`)
        }, {
          path: '/Login',
          name: 'Login',
          component: () => import(`@/components/Personnal/Admin/Login`)
        }, {
          path: '/Register',
          name: 'Register',
          component: () => import(`@/components/Personnal/Admin/Register`)
        }, {
          path: '/ModifyPass',
          name: 'ModifyPass',
          component: () => import(`@/components/Personnal/Admin/ModifyPass`)
        }
      ]
    }, {
      path: '/Myinvestment',
      name: 'Myinvestment',
      component: () => import(`@/components/Personnal/Investment`)
    }, {
      path: '/Logs',
      name: 'Logs',
      component: () => import(`@/components/Personnal/Logs`)
    }, {
      path: '/Myborrows',
      name: 'Myborrows',
      component: () => import(`@/components/Personnal/Myborrows/Myborrows`)
    },
    {
      path: '/Safe',
      name: 'Safe',
      component: () => import(`@/components/Personnal/Safe/Safe`)
    }, {
      path: '/user',
      name: 'user',
      component: () => import(`@/components/Personnal/user`)
    }, {
      path: '/About',
      name: 'About',
      component: () => import(`@/components/Personnal/About`)
    }, {
      path: '/Gift',
      name: 'Gift',
      component: () => import(`@/components/Personnal/Gift`)
    }, {
      path: '/Help',
      name: 'Help',
      component: () => import(`@/components/Personnal/Help/Help`)
    }, {
      path: '/Setting',
      name: 'Setting',
      component: () => import(`@/components/Personnal/Setting`)
    }, {
      path: '/Recharge',
      name: 'Recharge',
      component: () => import(`@/components/Personnal/Comm/Recharge`)
    }, {
      path: '/coinoperation',
      name: 'coinoperation',
      component: () => import(`@/components/Personnal/coinoperation`)
    },
    {
      path: '/Kycinput',
      name: 'kycinput',
      component: () => import(`@/components/Personnal/Safe/kycinput`)
    },
    {
      path: '/Language',
      name: 'Language',
      component: () => import(`@/components/Personnal/Setting/Language`)
    },
    // { //ICO公募
    //   path:'/tokensale',
    //   name: 'tokensale',
    //   component: () => import(`@/components/TokenSale/TokenSale.vue`)
    // },
    { /*新版靠海行动用户推广页 */
      path: '/recommendact',
      name: 'recommendact',
      component: () => import('@/components/TokenSale/recommendact.vue')
    },
    {
      path: '*',
      component: () => import(`@/components/404`)
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})

// 全局 before 钩子: 进入下一个路由前， 修改 Vuex 中的 breadcrumb 内容
router.beforeEach((to, from, next) => {
  // console.log(to)
  // store.dispatch('breadcrumbUpdate', breadcrumbList)
  next()
})
export default router
