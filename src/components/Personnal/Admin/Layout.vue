<template>
<div id="usercenter">
    <img src="../../../../static/images/icon/pic_nav.png" @touchend="goBack" alt="后退">
    <img class="logobg" src="https://s.lendx.vip/images/personnal/module1/bg.png" alt="背景图">
    <router-view/>
</div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'

let endtime=60
let interval
export default {
    data() {
        return {
            mail: "",
            pwd: "",
            mailcode: "",
            isgetting: false, //true代表正在发送验证码
            tipState:false,
            redirect: this.$route.query.redirect //拿到上级路由传过来的地址，用于登录后的重定向
        };
    },
    mounted() {
    },
    methods: {
        ...mapActions(['changeState']),
        cancelalert(e) {
            this.$router.push({
                path: '/Personnal'
            });
        },
        goBack(){ //回退
            this.$router.go(-1);    
        },
        toShowTip(){
            this.tipState = !this.tipState;
        },
        confirm() {
            //检测邮箱密码是否正确
            if (!this.LEND.checkMail(this.$data.mail)) {
                this.$toast('E-mail format input error, please enter again');
                return;
            } else if (this.act != 'login') {
                if (this.LEND.checkPass(this.$data.pwd) < 3) {
                    this.$toast('The password setting is wrong, the password must must have 8-20 characters and contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and symbols');
                    return;
                }
            }
            if (this.act == 'regist') {
                if (this.mail == this.pwd) {
                    this.$toast('There must be a difference between a email and a password');
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
                                    msg = 'Sign Up success';
                                } else {
                                    msg = 'Password change successful';
                                }
                                this.$toast(msg);
                                this.mailcode = '';
                                this.act = 'login';
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Send Email";
                                this.$data.isgetting = false;
                                clearInterval(interval);
                                return {signup:true};
                            } else if (trueUrl.indexOf('/oauth/token') != -1) {
                                this.LEND.localStorage('access_token', res.access_token, {
                                    expires: res.expires_in
                                });
                                
                                this.$toast('Login success');
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
                            this.$toast('success failed');
                        }
                }
            })    
        },
        sendmailcode() {
            if (!this.LEND.checkMail(this.$data.mail)) {
                this.$toast('email format input error, please enter again');
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
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Resend code(" + endtime + ")";
                                endtime--;
                            } else {
                                this.$data.isgetting = false;
                                endtime = 60;
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "send email"
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
@import '../../../assets/css/MyCenter.scss'
</style>
<style scoped>
#usercenter{
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
</style>
