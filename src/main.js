// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '../static/css/public.css'
import 'swiper/dist/css/swiper.css'
import 'lib-flexible'
import Draggable from 'gsap/Draggable' // eslint-disable-line
import ScrollToPlugin from 'gsap/ScrollToPlugin' // eslint-disable-line
import './axiosConfig/axiosConfig'
import layer from 'vue-layer'
import LEND from '@/util/util'
import {
  Posturl,
  Domainurl as domainurl
} from '../static/js/config'
import { Toast, InfiniteScroll, Spinner, MessageBox, Lazyload, Swipe, SwipeItem, Popup, DatetimePicker, Picker } from 'mint-ui'
import VeLine from 'v-charts/lib/line'
import vueTap from 'v-tap'
import xss from 'xss'
import clipboard from 'clipboard'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    'zh-CN': require('@/lang/zh_CN'), // 中文语言包
    'en-US': require('@/lang/EN') // 英文语言包
  }
})
Vue.prototype.clipboard = clipboard
Vue.component(VeLine.name, VeLine)
Vue.component(Spinner.name, Spinner)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.use(Lazyload)
Vue.use(InfiniteScroll)
Vue.use(vueTap)
Vue.config.productionTip = false
Vue.prototype.LEND = LEND // 挂载到Vue实例上面
Vue.prototype.domainurl = domainurl
Vue.prototype.Posturl = Posturl
Vue.prototype.$toast = Toast
Vue.prototype.$MessageBox = MessageBox
Vue.prototype.$layer = layer(Vue, {
  msgtime: 2 // 目前只有一项，即msg方法的默认消失时间，单位：秒
})

function vueTouch (el, binding, type, vnode) {
  var _this = this
  this.obj = el
  this.binding = binding
  this.touchType = type
  this.vueTouches = {
    x: 0,
    y: 0
  }
  this.vueMoves = true
  this.vueLeave = true
  this.longTouch = true
  this.vueCallBack = typeof (binding.value) === 'object' ? binding.value.fn : binding.value
  this.obj.addEventListener('touchstart', function (e) {
    _this.start(e)
  }, false)
  this.obj.addEventListener('touchend', function (e) {
    _this.end(e)
  }, false)
  this.obj.addEventListener('touchmove', function (e) {
    _this.move(e)
  }, false)
  vnode.key = this.randomString()
};
vueTouch.prototype = {
  start: function (e) {
    this.vueMoves = true
    this.vueLeave = true
    this.longTouch = true
    this.vueTouches = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    }
    this.time = setTimeout(function () {
      if (this.vueLeave && this.vueMoves) {
        this.touchType === 'longtap' && this.vueCallBack(this.binding.value, e)
        this.longTouch = false
      };
    }.bind(this), 1000)
  },
  end: function (e) {
    var disX = e.changedTouches[0].pageX - this.vueTouches.x
    var disY = e.changedTouches[0].pageY - this.vueTouches.y
    clearTimeout(this.time)
    if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
      this.touchType === 'swipe' && this.vueCallBack(this.binding.value, e)
      if (Math.abs(disX) > Math.abs(disY)) {
        if (disX > 10) {
          this.touchType === 'swiperight' && this.vueCallBack(this.binding.value, e)
        };
        if (disX < -10) {
          this.touchType === 'swipeleft' && this.vueCallBack(this.binding.value, e)
        };
      } else {
        if (disY > 10) {
          this.touchType === 'swipedown' && this.vueCallBack(this.binding.value, e)
        };
        if (disY < -10) {
          this.touchType === 'swipeup' && this.vueCallBack(this.binding.value, e)
        };
      };
    } else {
      /*       if (this.longTouch && this.vueMoves) {
        this.touchType === 'tap' && this.vueCallBack(this.binding.value, e)
        this.vueLeave = false
      }; */
    };
  },
  move: function (e) {
    this.vueMoves = false
  },
  randomString: function () {
    var len = 10
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = $chars.length
    var pwd = ''
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }
}
/* eslint-disable */
/* Vue.directive('tap', {
  bind: function(el, binding, vnode) {
    new vueTouch(el, binding, 'tap', vnode)
  }
}) */
Vue.directive('swipe', {
  bind: function(el, binding, vnode) {
    new vueTouch(el, binding, 'swipe', vnode)
  }
})
Vue.directive('swipeleft', {
  bind: function(el, binding, vnode) {
    new vueTouch(el, binding, 'swipeleft', vnode)
  }
})
Vue.directive('swiperight', {
  bind: function(el, binding, vnode) {
    new vueTouch(el, binding, 'swiperight', vnode)
  }
})
Vue.directive('swipedown', {
  bind: function(el, binding, vnode) {
    new vueTouch(el, binding, 'swipedown', vnode)
  }
})
Vue.directive('swipeup', {
  bind: function(el, binding, vnode) {
    new vueTouch(el, binding, 'swipeup', vnode)
  }
})
Vue.directive('longtap', {
  bind: function(el, binding, vnode) {
    new vueTouch(el, binding, 'longtap', vnode)
  }
})


new Vue({
  el: '#app',
  router,
  store,
  i18n, // 最后
  components: {
    App
  },
  template: '<App/>'
})
/* eslint-enable */
