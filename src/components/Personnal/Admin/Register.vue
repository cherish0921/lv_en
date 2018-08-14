<template>
<div id="usercenter">
    <div class="alisc-propup" v-show="showAlisc">
        <div id="alisc"></div>
    </div>
    <div class="centername">
        <span>Sign Up</span>
    </div>
    <div class="inputs">
        <div>
            <img src="../../../../static/images/personnal/module1/cart2.png" alt="Enter email">
            <input type="text" v-model.trim="mail" placeholder="Enter email" autocomplete="off">
        </div>
        <div>
            <img src="../../../../static/images/personnal/module1/cart3.png" alt="Email Code">
            <input type="text" v-model="mailcode" placeholder="Email Code"  autocomplete="off">
            <span v-if="!isgetting" style="position:absolute;z-index:91;right:1.07rem;color:#509fff;font-size:14px;"  id="Countdownvala"  @touchend="sendmailcode">Send Email</span>
            <span v-if="isgetting" style="position:absolute;z-index:91;right:1.07rem;color:#999;font-size:14px;" id="Countdownvala" >Send Email</span>
        </div>
        <div>
            <img src="../../../../static/images/personnal/module1/cart1.png" alt="password">
            <input type="password" v-model="pwd" placeholder="Enter password"  autocomplete="off">
            <div class="tip-box"  v-show="tipState">
                <p v-show="tipState">8-20 characters and contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and symbols.</p>
                <img  src="../../../../static/images/personnal/module1/tip.png"  style="opacity: 0;" alt="tip">
            </div>
            <img id="taparea" @touchend="toShowTip" src="../../../../static/images/personnal/module1/tip.png" alt="tip">
        </div>
        <div v-if="!code">
            <img src="../../../../static/images/personnal/module1/cart4.png" alt="Inviter's ID">
            <input v-model="Inviter" type="text" placeholder="Enter the Inviter's ID (optional)"  autocomplete="off">
        </div>
    </div>
    <div class="confirmbtn" @touchend="confirm">Sign Up</div>
    <div class="otheract">
        <span><router-link to="/Login" style="color:#509fff;">Login</router-link></span>
    </div>
</div>
</template>
<script>
import {mapActions} from 'vuex'

let endtime = 60;
let interval;

export default {
    data() {
        return {
            mail: "", //邮箱
            mailcode: "",  //验证码
            pwd: "",  //密码
            Inviter: '', //邀请码
            code: '', //获取分享的邀请链接
            isgetting: false, //true代表正在发送验证码
            tipState:false,  //默认不显示提示框
             showAlisc:false,
        }
    },
    created() {
        // let urlPath = this.$router.currentRoute.fullPath;
        // let index = urlPath.indexOf('code');
        // if (index != -1) {
        //     this.code = urlPath.substring(index + 5);
        // }
        if(this.getQueryString('code')){
            this.code =this.getQueryString('code')
        }
        if(this.getQueryString('source')){
            this.LEND.localStorage('source',Number(this.getQueryString('source')))
        }
    },
    mounted(){
         let that=this
        var nc_token = ["FFFF0N0000000000649D", (new Date()).getTime(), Math.random()].join(':');
    var nc=NoCaptcha.init({
        renderTo: '#alisc',
        appkey: 'FFFF0N0000000000649D', 
        scene: 'nc_message_h5',
        token: nc_token,
        trans: {"key1": "code200"},
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "en",
        timeout: 10000,
        retryTimes: 5,
        errorTimes: 5,
        inline:false,
        apimap: {
            // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
            // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
        },
        bannerHidden:false,
        initHidden:false,
        callback: function (data) {
            that.showAlisc=false;
            nc.reset()
             that.successSend('FFFF0N0000000000649D','nc_message_h5',nc_token,data.csessionid,data.sig)
        },
        error: function (s) {
        }
    });
    NoCaptcha.setEnabled(true);
    nc.reset();//请务必确保这里调用一次reset()方法

    NoCaptcha.upLang('cn', {
        'LOADING':"加载中...",//加载
        'SLIDER_LABEL': "请向右滑动验证",//等待滑动
        'CHECK_Y':"验证通过",//通过
        'ERROR_TITLE':"非常抱歉，这出错了...",//拦截
        'CHECK_N':"验证未通过", //准备唤醒二次验证
        'OVERLAY_INFORM':"经检测你当前操作环境存在风险，请输入验证码",//二次验证
        'TIPS_TITLE':"验证码错误，请重新输入"//验证码输错时的提示
    });
     /*  */
    },
    methods: {
        ...mapActions(['changeState']),
        toShowTip(){
            this.tipState = !this.tipState;
        },
        confirm() {
            //检测邮箱密码是否正确
            if(!this.mail){
                  this.$toast('there must enter you email address');
            }
            if (!this.LEND.checkMail(this.mail)) {
                this.$toast('email format input error, please enter again');
                 return;
            } else if (this.LEND.checkPass(this.pwd) < 3) {
                this.$toast({position:'top',message:'The password setting is wrong, the password must be 8-20 characters and contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and symbols.',duration:15000});
                 return;
            } else if (this.mail == this.pwd) {
                this.$toast('There must be a difference between a email and a password');
                return;
            }
            if(this.mailcode.toString().length!=4){
               this.$toast('There must be a four-digit e-mail verification code');
               return ;
            }
            let data = {
                email: this.mail,
                emailCode: this.mailcode,
                pwd: this.pwd,
                code: this.code||this.Inviter,
                source: this.LEND.localStorage('source')?String(Number(this.LEND.localStorage('source'))):''
            };
            this.$axios.post('/trade/account/signup', data).then(res => {
                if(res.code!=2000){
                    this.$toast(res.message);
                }else{
                    if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Send Email";
                    this.isgetting = false;
                    clearInterval(interval);
                }
                return res.code;
            }).then((code)=>{
                if(code==2000){
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
                            this.$toast('Sign Up and Login success');
                            this.changeState({
                                type: 'haslogin',
                                value: true
                            });
                            this.$router.replace({
                                path: '/Personnal'
                            }); 
                        }
                        break;
                    default:
                        {
                            this.$toast('Login failed');
                        }
                }
            })    
        },
          successSend(appKey,scene,token,sessionId,sig){
            this.$axios.post('/trade/mail/send', {
                    email: this.mail,
                    type: 1,
                    appKey:appKey,
                    scene:scene,
                    token: token,
                    sessionId: sessionId,
                    sig: sig,
                }).then(res => {
                    if (Number(res.code) !== 2000) {
                        this.$toast(res.message);
                        return;
                    }
                    this.isgetting = true;
                    endtime = 60;
                    this.showAlisc = false;
                    if (this.isgetting) {
                        interval = setInterval(() => {
                            if (endtime >= 0) {
                               if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Resend code(" + endtime + ")";
                                endtime--;
                            } else {
                                this.isgetting = false;
                                endtime = 60;
                                 if(document.getElementById('Countdownvala'))document.getElementById('Countdownvala').innerHTML = "Send Email";
                                clearInterval(interval);
                            }
                        }, 1000)
                    }
                });
        },
        sendmailcode() {
            if (!this.LEND.checkMail(this.$data.mail)) {
                 this.$toast('email format input error, please enter again');
                return;
            } else {
              this.showAlisc = true;
            }
        },
        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    }
}
</script>
<style lang="sass" scoped>
@import '../../../assets/css/MyCenter.scss'
</style>
<style scoped>
.alisc-propup{
    position: absolute;
    width: 9.2rem;
    margin: 0 .4rem;
    top: 3rem;
    font-size: 16px;
    background-color: #fff;
    z-index: 1000;
}
.alisc-propup p{
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    border:1px solid #ddd;
    border-bottom: 0;
    position: relative;
}
.alisc-propup p img{
    position: absolute;
    width: 12px;
    top: 5px;
    right: 5px;
    z-index: 1001
}
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
}
#usercenter .inputs > div input {
  display: inline-block;
  font-size: 12px;
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
