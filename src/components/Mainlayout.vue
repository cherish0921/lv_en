<template>
    <div class="footernav">
        <div class="indexfooterMenu font12 darktipcolor">
            <!-- @touchend="footMenutap(1)" -->
            <ul>
                <router-link :to="{ path: '/Index'}" active-class="active">
                    <li  class="unconfig">
                        <img src="../../static/images/icon/footnav1a@2x.png" alt="home" class="noactiveicon"/>
                        <img src="../../static/images/icon/footnav1b@2x.png" alt="home" class="activeicon"/>
                    </li>
                </router-link>
                <router-link :to="{ path: '/Investment'}" active-class="active">
                    <li>
                        <img src="../../static/images/icon/footnav2a@2x.png"  alt="Loan" class="noactiveicon"/>
                        <img src="../../static/images/icon/footnav2b@2x.png"   alt="Loan" class="activeicon"/>
                    </li>
                </router-link>
               <router-link :to="{ path: '/Borrow'}" active-class="active">
                    <li>
                        <img src="../../static/images/icon/footnav3a@2x.png"   alt="Borrow" class="noactiveicon"/>
                        <img src="../../static/images/icon/footnav3b@2x.png"   alt="Borrow" class="activeicon"/>
                    </li>
                 </router-link> 
                <router-link :to="{ path: mineLink}" active-class="active">
                    <li>
                        <img src="../../static/images/icon/footnav4a@2x.png"   alt="Me" class="noactiveicon"/>
                        <img src="../../static/images/icon/footnav4b@2x.png" alt="Me" class="activeicon"/>
                    </li>
                </router-link>
            </ul>
        </div>
        <router-view/>
    </div>
</template>

<script>
import {mapState,mapGetters,mapActions} from 'vuex'
import shadebgtip from './common/shadebgtip'

let initworked=false;//是否已经初始化

export default {
    name: "App",
    data() {
        return {
            shadebgtip: false,
            mineLink:'/Personnal' //点击我的按钮链接到的路由
        }
    },
    // computed:{
    //     ...mapState(['blockchain'])
    // },
    mounted() {
        this.initfn()
        var pagesArr = ["", "Index", "Investment", "Borrow", "Personnal"];
        let index = Math.abs(pagesArr.findIndex((page) => {
            return location.href.indexOf(page) > 0
        })); //index 下标
        if (this.$store.state.blockchain == 0) { //在应用内但未绑定
            this.mineLink = '/UserCenterNoBind';
        } else {
            this.mineLink = '/Personnal';
        }
    },
    updated() {
        var pagesArr = ["", "Index", "Investment", "Borrow", "Personnal"];
        let index = Math.abs(pagesArr.findIndex((page) => {
            return location.href.indexOf(page) > 0
        })); //index 下标
    },
    computed: {
        ...mapState({
            'mainmodule': 'mainmodule'
        }),
        ...mapGetters(['showfootMenu']),
        computequery() {
            return {
                module: (this.LEND.localStorage('haslogin') ? 1 : 0),
                buyId: 0
            }
        }
    },
    methods: {
            getUserInfo() { //获得个人信息
            // this.changeState({type:'isloading',value:true})
            this.$axios.get(`/trade/user/profile`).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.LEND.localStorage('nickname', res.data.nickname);
                            this.LEND.localStorage('email', res.data.email);
                            let phone = res.data.phone == 'null'?'':res.data.phone;
                            this.LEND.localStorage('phone',phone);
                            this.nickname = res.data.nickname?res.data.nickname:res.data.email;
                            this.changeState({
                                type: 'haslogin',
                                value: true
                            });
                            this.userInfoData = res.data;
                            this.totalAmount = this.userInfoData.totalAmount?this.userInfoData.totalAmount.toFixed(2):'';
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
                // this.changeState({type:'isloading',value:false})
            });
        },
        initfn: function() {
            if (initworked) {
                return false;
            }
            initworked = true
            if ((this.LEND.getQueryString('agent') || '').indexOf('block') != -1) {
                this.$store.dispatch("changeState", {type: 'blockchain',value: -1}); //通过UA是否在blockchain内，如果是，则blockchain=-1
                    this.LEND.localStorage("haslogin",false)
                    this.LEND.removeLocalStorage("igoogle")
                    this.LEND.removeLocalStorage("iphone")
                    this.LEND.removeLocalStorage("nickname")
                    this.LEND.removeLocalStorage("phone")
                    this.LEND.removeLocalStorage("email")
               if (this.LEND.getQueryString('uuid')) {
                    //  alert('uuid_b '+this.LEND.getQueryString('uuid'))
                    this.LEND.localStorage('uuid_b', this.LEND.getQueryString('uuid'))
                }
                if (this.LEND.getQueryString('access_token')) {
                    this.LEND.localStorage('access_token_b', this.LEND.getQueryString('access_token'))
                }
                if (this.LEND.localStorage('uuid_b') && this.LEND.localStorage('access_token_b')) {
                    //   alert('曾经已经授权过'+' '+this.LEND.localStorage('uuid_b'))
                    //uuid和access_token存在，默认已授权请求授权
                    this.$axios.post('/trade//oauth/token?grant_type=password', {
                        username: this.LEND.localStorage('uuid_b'),
                        password: this.LEND.localStorage('access_token_b'),
                        client: 'frontend'
                    }).then(res => {
                        if (Number(res.code) === 2000) {

                            this.getUserInfo()
                            this.$store.dispatch("changeState", {type: 'blockchain',value: res.data.identif.email == '' ? 0 : 1});
                           // alert('blockchain'+this.$store.state.blockchain)
                            if (res.data.identif.email == '') { //在应用内但未绑定
                                this.mineLink = '/UserCenterNoBind';
                            } else {
                                this.mineLink = '/Personnal';
                            }
                        } else if (Number(res.code) === 1006) {
                            //   alert('授权失效')
                            //登陆时返回状态是1006  请求重新授权
                            location.href = "/trade/gxb/authorize"
                        } else {
                            this.$toast('net error')
                        }
                    })
                } else {
                    // alert('未授权过')
                     location.href = "/trade/gxb/authorize"
                    //uuid access_token不存在，则为未授权==>重新请求授权
                }
            }
        },
        fetchData: function() {}
    }
}
</script>

<style lang="scss">
html,body{font:12px/1.14 San Francisco,-apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
    background-color: #f5f5f5; }
#app {
  font-family: San Francisco,-apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #262626;
}
body:lang(zh-CN),#app {
    font-family: "SF Pro SC","SF Pro Text","SF Pro Icons","PingFang SC","Helvetica Neue","Helvetica","Arial",sans-serif;
}
html,body{font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;}
.indexfooterMenu {
  position: fixed;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  border-top: 1px solid #e6e6e6;
  z-index: 70;
  ul{ width: 100%;
  display: flex;
  height: 1.32rem;
  line-height: 1.32rem;
  flex-direction: row;
  a{
    flex: 1;
    display: inline-flex;
    align-items: center;
    li{display: inline-block;width: 100%;background-color:#fff;
        img{
            height: 1rem;
            vertical-align:middle;
            margin: 0px auto;
            &.noactiveicon{
                display: block;
            }
            &.activeicon{display: none;}
        }
    }
    &.active{
       li img.noactiveicon{display: none;}
       li img.activeicon{display: block;}
    }
  }
}}
.lendchainfade0-enter-active, .lendchainfade0-leave-active {transition: all 1s;}
.lendchainfade0-enter, .lendchainfade0-leave-active {opacity: 0;}
.lendchainfade0-enter ,.lendchainfade0-leave-to{transform: translateX(10rem);}
.lendchainfade1-enter-active, .lendchainfade1-leave-active {transition: all .6s;}
.lendchainfade1-enter, .lendchainfade1-leave-active {opacity: 0;}
.lendchainfade1-enter,.lendchainfade1-leave-to {transform: translateY(10rem);}

.lendchainfade2-enter-active {transition: all .6s ease;}
.lendchainfade2-leave-active {transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
.lendchainfade2-enter, .lendchainfade2-leave-to{ transform: translateY(-1.33rem); opacity: 0;}
.lendchainfade3-leave-active{transform: translateY(1.33rem)}
.lendchainfade3-enter-active, .lendchainfade3-leave-active {transition: opacity .5s;}
.lendchainfade3-enter, .lendchainfade3-leave-active { opacity: 0;}

.lendflip-list1-move {transition: transform .6s;}
.vl-notify-content input{display: block;width: 100%;height: 36px;margin: 0 auto;line-height: 30px;padding-left: 10px; border: 1px solid #e6e6e6;color: #333;}
</style>
