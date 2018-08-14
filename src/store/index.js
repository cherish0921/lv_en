import Vue from 'vue'
import Vuex from 'vuex'
// import router from '../router/index'
// import createLogger from '../../../src/plugins/logger'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
/* 接口cookie
uid:100007
access-token:ce98730ca87302f2dd70358e5f377381e84b758d
nickname:qianm*****@163.com
igoogle:0
iphone:0
*/
const state = {
  haslogin: false, // 已经登录
  blockchain: -1, // -1默认在应用外，0在应用内已授权但未绑定lendchain，1在应用内已授权且已绑定lendchain
  mainmodule: 1,
  module: 0,
  phone: '',
  email: '',
  uid: 0,
  isloading: false //控制loading显示隐藏
}
// mutations改变数据
const mutations = {
  change_haslogin (state, haslogin) { state.haslogin = haslogin },
  change_blockchain (state, blockchain) { state.blockchain = blockchain },
  change_mainmodule (state, mainmodule) { state.mainmodule = mainmodule },
  change_module (state, module) { state.module = module },
  change_phone (state, phone) { state.phone = phone },
  change_email (state, email) { state.email = email },
  change_uid (state, uid) { state.uid = uid },
  change_isloading (state, bool) { state.isloading = bool }
}
// 组件中初步获取和简单处理state里面的数  【getters】是store的计算属性。compute  第一个参数是state 可以接受其他的getters作为第二个参数；
// array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
const getters = {
  state: stage => stage,
  showfootMenu: (state) => {
    return state.module === 0
  },
  isloading: state => state.isloading,
  haslogin: state => state.haslogin
}
// actions   actions和mutations对应于methods,但是一般暴露actions
const actions = {
  changeState ({commit, state}, params) {
    let mutationname = params.type
    commit('change_' + mutationname, params.value)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug//
  // plugins: debug ? [createLogger()] : []
})
