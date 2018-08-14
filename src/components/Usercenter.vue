<template>
<div id="usercenter">
    <img src="../../static/images/icon/pic_nav.png" @touchend="cancelalert" alt="">
    <img class="logobg" src="https://s.lendx.vip/images/personnal/module1/bg.png" alt="背景图">
    <div class="centername">
        <span v-if="act=='regist'">注册</span>
        <span v-if="act=='login'">登录</span>
        <span v-if="act=='password'">忘记密码</span> 
    </div>
    <div class="inputs">
        <div>
            <img src="../../static/images/personnal/module1/cart2.png" alt="邮箱">
            <input type="text" v-model="mail" placeholder="请输入邮箱">
        </div>
        <div v-if="act!='login'">
            <img src="../../static/images/personnal/module1/cart3.png" alt="验证码">
            <input type="text" v-model="mailcode" placeholder="请输入邮箱验证码">
            <span v-if="!isgetting" style="position:absolute;z-index:91;right:1.07rem;color:#509fff;font-size:14px;"  id="Countdownvala"  @touchend="sendmailcode">发送验证码</span>
            <span v-if="isgetting" style="position:absolute;z-index:91;right:1.07rem;color:#999;font-size:14px;" id="Countdownvala" >发送验证码</span>
        </div>
        <div>
            <img src="../../static/images/personnal/module1/cart1.png" alt="密码">
            <input type="password" v-model="pwd" :placeholder="act=='password'?'请输入新密码':'请输入密码'">
            <div class="tip-box"  v-show="tipState">
                <p v-show="tipState">8 - 20 位，大写英文、小写英文、符号、数字至少有三类。</p>
                <img  src="../../static/images/personnal/module1/tip.png"  style="opacity: 0;" alt="">
            </div>
            <img id="taparea" @touchend="toShowTip" src="../../static/images/personnal/module1/tip.png" alt="">
        </div>
        <div v-if="act=='regist'">
            <img src="../../static/images/personnal/module1/cart4.png" alt="邀请码">
            <input v-model="Inviter" type="text" placeholder="如有邀请人，请输入邀请码">
        </div>
    </div>
    <div class="confirmbtn" @touchend="confirm">{{(act=="regist")?"提交":((act=="login")?"确认登录":"确认修改")  }}</div>
    <div class="otheract">
        <span v-if="act=='regist'" @touchend="changeact('login')">去登录</span>
        <span v-if="act!='regist'" @touchend="changeact('regist')">去注册</span>
        <span v-if="act!=='password'" @touchend="changeact('password')">忘记密码？</span>
    </div>
</div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'

let endtime=60
let interval
export default {
    data() {
        return {
            act: "",
            mail: "",
            pwd: "",
            mailcode: "",
            Inviter: "",
            isgetting: false, //true代表正在发送验证码
            tipState:false,
            redirect: this.$route.query.redirect //拿到上级路由传过来的地址，用于登录后的重定向
        };
    },
    props: {
        action: {
            type: String,
            default: 'login'
        }
    },
    mounted() {
        if (this.action) {
            this.act = this.action;
        }
    },
    methods: {
        ...mapActions(['changeState']),
        cancelalert(e) {
            this.$router.push({
                path: '/Personnal'
            });
        },
        toShowTip(){
            this.tipState = !this.tipState;
        },
        confirm() {
            //检测邮箱密码是否正确
            if (!this.LEND.checkMail(this.$data.mail)) {
                this.$toast('邮箱格式输入错误，请重新输入');
                return;
            } else if (this.act != 'login') {
                if (this.LEND.checkPass(this.$data.pwd) < 3) {
                    this.$toast('密码设置错误，密码必须是8-20位，大写英文、小写英文、符号、数字至少有3类');
                    return;
                }
            }
            if (this.act == 'regist') {
                if (this.mail == this.pwd) {
                    this.$toast('密码不能跟邮箱相同');
                    return;
                }
            }
            let urlArr = ['/trade/account/signup', '/trade/oauth/token?grant_type=password', '/trade/account/resetpwd'];
            let trueUrl = this.act == "regist" ? urlArr[0] : this.act == "login" ? urlArr[1] : urlArr[2];
            let data = this.act == "login" ? {
                username: this.mail,
                password: this.pwd,
                client: 'frontent'
            } : this.act == "regist" ? {
                email: this.mail,
                emailCode: this.mailcode,
                pwd: this.pwd,
                inviter: this.Inviter
            } : {
                email: this.mail,
                emailCode: this.mailcode,
                pwd: this.pwd
            };
            this.$axios.post(trueUrl, data).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            // this.$store.dispatch("changeState",{type:'haslogin',value:true});
                            // this.$emit('cancelalert')
                            if (trueUrl.indexOf('/account/signup') != -1 || trueUrl.indexOf('/account/resetpwd') != -1) {
                                let msg = '';
                                if (trueUrl.indexOf('/account/signup') != -1) {
                                    msg = '注册成功';
                                } else {
                                    msg = '密码修改成功';
                                }
                                this.$toast(msg);
                                this.mailcode = '';
                                this.act = 'login';
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "发送验证码";
                                this.$data.isgetting = false;
                                clearInterval(interval);
                                return {signup:true};
                            } else if (trueUrl.indexOf('/oauth/token') != -1) {
                                this.LEND.localStorage('access_token', res.access_token, {
                                    expires: res.expires_in
                                });
                                
                                this.$toast('登陆成功');
                                this.changeState({
                                    type: 'haslogin',
                                    value: true
                                });
                                this.$router.push({
                                    path: '/Personnal'
                                });
                                return {signup:false};
                            }
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
            }).then((obj)=>{
                if((obj.signup)){
                    this.login();
                }
            })
        },
        login(){
            this.$axios.post('/trade/oauth/token?grant_type=password', {
                username: this.mail,
                password: this.pwd,
                client: 'frontent'
            } ).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.pwd = '';
                            this.email = '';
                            this.LEND.localStorage('access_token', res.access_token);
                            this.changeState({
                                type: 'haslogin',
                                value: true
                            });

                            this.$router.push({
                                path: '/Personnal'
                            });
                        }
                        break;
                    default:
                        {
                            this.$toast('登录失败');
                        }
                }
            })    
        },
        sendmailcode() {
            if (!this.LEND.checkMail(this.$data.mail)) {
                this.$toast('邮箱格式不正确，请重新输入');
                return;
            } else {
                this.$axios.post('/trade//mail/send', {
                    email: this.$data.mail,
                    type: 1
                }).then(res => {
                    if (Number(res.code) !== 2000) {
                        this.$toast(res.message);
                        return;
                    }
                    this.$data.isgetting = true;
                    endtime = 60;
                    if (this.$data.isgetting) {
                        interval = setInterval(() => {
                            if (endtime >= 0) {
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "重新发送(" + endtime + ")";
                                endtime--;
                            } else {
                                this.$data.isgetting = false;
                                endtime = 60;
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "发送验证码"
                                clearInterval(interval);
                            }
                        }, 1000)
                    }
                });
            }
        },
        changeact(val) {
            this.act = val;
            this.mail = "";
            this.pwd = "";
            this.mailcode = "";
        }
    }
}
</script>
<style lang="sass" scoped>
@import '../assets/css/MyCenter.scss'
</style>
<style scoped>
.tip-box{
    position: absolute;
    text-align: right;
    display: inline-block;
    margin-top: -70px;
    right: .4rem;
    z-index: 92;
}
.tip-box p{
    height: 75px;
    line-height: initial;
    color: #509fff;
    background-color: #D6E9FF;
    padding: 3px;
    text-align: left;
    width: 180px;
    font-size: 12px;
}
.tip-box p:after{
    content: '';
    position: absolute;
    top: 70px;
    right:1rem;
    display: inline-block;
    width: 0;
    border: .12rem solid #D6E9FF;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
}
.tip-box .p2{
    background-color: transparent;
}
.tip-box .p2:after{
    border-color: transparent;
}
.tip-box img{    width:15px;margin-right: .4rem;}
#taparea{position: absolute;width: 15px;margin-right: .4rem;margin-top: .4rem;z-index:99;}
#usercenter {
  position: absolute;
  z-index: 90;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
#usercenter >img:first-child {
  position:absolute;
  z-index:91;
  height:.45rem;
  left:.4rem;
  top:.4rem;
  

}
#usercenter > .logobg {
  width: 100%;
}
.centername {
  margin-top: 0.4rem;
}
.centername span {
  font-size: 20px;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid #509fff;
}
#usercenter .inputs > div {
  margin: 0 1.07rem;
  height: 1.46rem;
  line-height: 1.46rem;
  border-bottom: 1px solid #e6e6e6;
  overflow: hidden;
  text-align: left;
}
#usercenter .inputs img:first-child {
    line-height: 1.17rem;
    position: absolute;
    height: 1.17rem;
    z-index: 91;
    padding: .3rem;
    float: left;
}
#usercenter .inputs > div input {
  display: inline-block;
  height: 100%;
  line-height: 1.46rem;
  border: 0;
  margin-left: 0.4rem;
  min-width: 80%;
}
.confirmbtn {
  line-height: 1.33rem;
  height: 1.33rem;
  margin: 0.8rem 1.07rem 0 1.07rem;
  font-size: 16px;
  color: #fff;
  border-radius: 36px;
  cursor: pointer;
  background: -webkit-gradient(
    linear,
    0% 0%,
    100% 0%,
    from(#509fff),
    to(#4886ff)
  );
  -webkit-box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
  box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
}
.otheract {
    font-size: 14px;
  margin: 0.4rem 1.07rem;
  text-align: left;
  color: #509fff;
  cursor: pointer;
}
.otheract span:nth-child(1) {
  float: right;
  right: 1.07rem;
}
</style>
