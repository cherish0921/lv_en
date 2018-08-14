<template>
  <div class="shadebg">
    <transition name="lendchainfade1">
        <div>
            <div class="toumingshade" v-if="toumingshow" >
                <img v-if='type=="b"' src="../../../static/images/icon/trueoptb@2x.png" alt=""> 
                <img v-if='type=="i"' src="../../../static/images/icon/trueopti@2x.png" alt="">
            </div>
            <header class="clearfloat">
                <img @touchend="rollback" src="../../../static/images/icon/pic_navb.png" alt="" srcset="">
                {{title}}
            </header>
            <div v-if='type==0' style="margin-bottom:.28rem;">
                <p class="bindtip">温馨提示：为注册您的新账号需要认证邮箱</p>
            </div>
            <div v-if='type==2' style="margin-bottom:.28rem;">
                <p class="bindtip">温馨提示：设置后不能更改</p>
            </div>
            <div class="content_gauth">
                <div class="gcode clearfloat" v-if='type<2'>
                    <span>邮箱账号</span>
                    <input type="text" v-model="b_email"  placeholder="请输入邮箱">
                </div>
                <div class="gcode clearfloat" v-if='type==0'>
                    <span>邮箱验证码</span>
                    <input type="text" v-model="b_code"  style="width:inherit;" placeholder="请输入邮箱验证码">
                    <span style="color:#509fff;"  v-show="!isgetting" @touchend="sendcode">发送验证码</span>
                    <span style="color:#999;"  v-show="isgetting" id="CountdownvalaEmail">发送验证码</span>
                </div>
                <div class="gcode clearfloat" v-if='type<2'>
                    <span>登录密码</span>
                    <input type="password" v-model="b_pwd"  placeholder="请输入登录密码">
                </div>
                <div class="gcode clearfloat" v-if='type==2'>
                    <span>昵称</span>
                    <input type="text" v-model="b_nickname"  placeholder="请输入昵称">
                </div>
                <div class="countrycode" v-if="type==1" style="width: 10rem;margin-left: 0;height: 1.33rem;line-height: 1.33rem;font-size: 14px;
                    background-color: #fff;text-align:left;border-bottom: 1px solid #e6e6e6;">
                    <contryCode :countryCode="countryCode" @excountry="excountry"></contryCode>
                </div>
                <div class="gcode clearfloat" v-if='type==3'>
                    <span>手机号</span>
                    <input type="text" v-model="b_phone"  placeholder="请输入手机号">
                </div>
                <div class="gcode clearfloat" v-if='type==3'>
                    <span>短信验证码</span>
                    <input type="text" v-model.trim="b_pcode"  style="width:4.6rem;" placeholder="请输入短信验证码">
                    <span v-show="!isgetting" style="color:#509fff;" @touchend="sendcode">发送验证码</span>
                    <span v-show="isgetting" style="color:#999;" id="Countdownvala">发送验证码</span>
                </div>
            </div>
            <div class="confirmbtn" @touchend="confirm">确定</div>
        </div>
    </transition>
  </div>
</template>
<script>
import { mapState,mapGetters,mapActions } from 'vuex'

let endtime = 60;
let interval;

export default {
    data() {
        return {
            gcode: '',
            title: '',
            wrongtipshow: false,
            toumingshow: false,
            b_email: '', //邮箱
            b_code: '', //邮箱验证码 
            b_pwd: '', //密码
            b_nickname: '', //昵称
            b_phone: '', //手机号码
            b_pcode: '', //手机验证码
            countryCode:'cn',//国别码
            countrynum:86,
            isgetting: false,
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        }
    },
    props: ['type','redirect'],
    mounted() {
        switch (Number(this.type)) {
            case 0: //
                this.title = "Generate LendChain Account"
                break;
            case 1: //
                this.title = 'Bind LendChain Account'
                break;
            case 2: //
                this.title = 'Set a Nickname'
                break;
            case 3:
                this.title = 'SMS Verification'
        }
    },
    methods: {
        ...mapActions(['changeState']),   
        excountry:function(item){
            this.countrynum=item.dialCode
        },
        rollback: function() {
            this.$emit('cancelputty');
        },
        sendCommMal(res,ele){ //发送验证码统一的操作
            if (Number(res.code) !== 2000) {
                this.$toast(res.message);
                return;
            }
            this.isgetting = true;
            endtime = 60;
            if (this.isgetting) {
                interval = setInterval(() => {
                    if (endtime >= 0) {
                        ele.innerHTML = "重新发送(" + endtime + ")";
                        endtime--;
                    } else {
                        this.isgetting = false;
                        endtime = 60;
                        ele.innerHTML = "发送验证码"
                        clearInterval(interval);
                    }
                }, 1000)
            }
        },
        sendcode() {
            let url = Number(this.type)==3?'/trade/sms/send-code':'/trade/mail/send';
            if(Number(this.type)==3){
                    if (!this.LEND.checkMobile(this.b_phone)) {
                        this.$toast('手机格式不正确，请重新输入');
                        return;
                    } 
                    this.$axios.post(url, {
                            countryCode: 86,
                            phone: this.$data.b_phone,
                            access_token: this.access_token,
                        }).then(res => {
                            let ele = document.getElementById('Countdownvala');
                            this.sendCommMal(res,ele);   
                    });
            }else if(Number(this.type)==0){
                if (!this.LEND.checkMail(this.b_email)) {
                        this.$toast('邮箱格式不正确，请重新输入');
                        return;
                    } 
                    this.$axios.post(url, {
                            email: this.b_email,
                            type: 1,
                        }).then(res => {
                            let ele = document.getElementById('CountdownvalaEmail');
                            this.sendCommMal(res,ele);   
                    }); 
            }
        },
        getUserInfo(){  //通过账号密码方式登陆并父组件回调调用用户信息接口存进cookie
            this.$axios.post("/trade/oauth/token?grant_type=password", {
                email: this.b_email,
                pwd: this.b_pwd
            }).then((result) => {
                switch (Number(result.code)) {
                    case 2000:
                        {
                            this.LEND.localStorage('access_token', res.access_token, { //重新存 access_token
                                expires: res.expires_in
                            });
                            this.changeState({type: 'haslogin',value: true}); //改为登陆状态
                            this.changeState({type: 'blockchain',value: 1}); // 改为在应用中
                            this.$toast('绑定成功');
                            // this.$emit('cancelputty');
                            this.$router.push({path:'/Personnal'});
                            break;
                        }
                    default:
                        {
                            this.$toast(result.message);
                        }
                }
            })
        },
        quitapp() { //退出登录
            this.$axios.get(`/trade/mfa/generate`).then(res => {
                if (Number(res.code) !== 2000) {
                    this.$toast('请求出错');         
                } else {
                    this.LEND.removeLocalStorage('access_token');
                }
            });
        },
        confirm() {
            if (this.type == 0) { //生成LendChain账号
                let params = {
                    email: this.b_email,
                    emailCode: this.b_code,
                    pwd: this.b_pwd,
                    access_token: this.LEND.localStorage('access_token')
                };
                this.$axios.post("/trade/gxb/create", params).then((result) => {
                    switch (Number(result.code)) {
                        case 2000:
                            {
                                this.changeState({type: 'blockchain',value: 1}); //在应用内并绑定
                                break;
                            }
                        default:
                            {
                                this.$toast(result.message);
                            }
                    }
                }).then((res)=>{
                    if(Number(result.code)==2000){
                        this.getUserInfo();        
                    }
                });
            } else if (this.type == 1) { //绑定LendChain账号
                if (!this.LEND.checkMail(this.$data.b_email)) {
                    this.$toast('邮箱格式输入错误，请重新输入')
                } else if (this.LEND.checkPass(this.$data.b_pwd) < 3) {
                    this.$toast('密码错误，密码必须是8-20位，大写英文、小写英文、符号、数字至少有3类')
                } else {
                    let params = {
                        email: this.b_email,
                        pwd: this.b_pwd,
                        access_token: this.LEND.localStorage('access_token')
                    };
                    this.$axios.post("/trade/gxb/bind", params).then((result) => {
                        switch (Number(result.code)) {
                            case 2000:
                                {
                                    this.changeState({type: 'blockchain',value: 1}); //在应用内并绑定
                                    break;
                                }
                            default:
                                {
                                    this.$toast(result.message);
                                }
                        }
                    }).then((res)=>{ 
                        if(Number(result.code)==2000){
                            this.quitapp();    //先退出登录    
                        }
                    }).then((res)=>{ 
                        if(Number(result.code)==2000){
                            this.getUserInfo();    //重新用邮箱密码登录    
                        }
                    });
                }

            } else if (this.$props.type == 2) {  //设置昵称
                let setname = this.$data.b_nickname;
                setname = setname.replace(/["+"\u0000-\u001F"+"\u007F-\u00A0" +"]/g, "");
                if (setname.length <= 0) {
                    this.$toast('昵称不能为空', {
                        time: 2000
                    });
                    return false;
                } else if (setname.length > 8) {
                    this.$toast('昵称长度非法，昵称长度不能大于8位', {
                        time: 2000
                    });
                    return false;
                } else {
                    layindex = this.$layer.confirm('昵称一旦设置，无法修改。是否确定设置您的昵称为' + setname + "?", {
                        btn: ['确定', '取消'] //按钮
                    }, function() {
                        this.$axios.post("/trade/sms/auth-phone", {
                            'nickname': setname
                        }).then((result) => {
                            switch (Number(result.code)) {
                                case 2000:
                                    {
                                        this.$toast('昵称设置成功', {
                                            time: 2000
                                        });
                                        //this.LEND.localStorage('nickname', setname, { expires: 7, domain: domainurl });
                                        break;
                                    }
                                default:
                                    {
                                        this.$toast(result.message.toString());
                                    }
                            }
                        });
                        this.$layer.close(layindex);
                    }, function() {
                        this.$layer.close(layindex);
                    });
                }

            } else if (this.$props.type == 3) {
                //调用api绑定手机号
                if (this.$data.b_phone <= 0) {
                    this.$toast('您的手机号暂未填写')
                } else if (this.$data.b_pcode <= 0) {
                    this.$toast('请先输入验证码')
                } else if(!(/^[0-9]{4}$/.test(this.b_pcode))){
                    this.$toast('验证码只能是4位数字')
                    return;
                }else{
                    this.$axios.post("/trade/sms/auth-phone", {
                        countryCode: 86,
                        phone: this.b_phone,
                        code: this.b_pcode,
                        access_token: this.access_token
                    }).then((res) => {
                        switch (Number(res.code)) {
                            case 2000:
                                this.$toast("手机认证成功");
                                this.b_phone = '';
                                this.b_pcode = '';
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "发送验证码";
                                this.isgetting = false;
                                clearInterval(interval);
                                this.activePhone = this.LEND.localStorage('iphone',1);
                                if (this.redirect) { //存在就重定向回原来的路由
                                    this.$router.replace({path: this.redirect});
                                } else { //不存在就隐藏弹窗
                                    this.$emit('cancelputty');
                                }
                                break;
                            default:
                                this.$toast(res.message.toString());
                                break;
                        }
                    })
                }
            }
        }
    }
}
</script>

<style scoped>
.shadebg{position: fixed;width: 100%;min-height:100%;top:0;left:0;right:0;z-index:100;background-color:#f5f5f5;}
header{margin-bottom:.28rem;height:1.17rem;line-height:1.17rem;font-size: 16px;color:#000;background-color: #fff;box-shadow:1px 0px 0px rgba(0,0,0,0.1)}
header img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;;float:left;}
header span{line-height: 1.17rem;height:1.17rem;}
.content_gauth >div>span:first-child{display: inline-block;width:2.6rem;text-align: left;color:#999;float: left; padding-left: .4rem;}
.content_gauth .gcode{height:1.33rem;line-height:1.33rem;font-size: 14px;background-color: #fff;border-bottom:1px solid #e6e6e6;}
.content_gauth .gcode:last-child{border:0;}
.content_gauth .gcode input{width:7rem;font-size: 16px;background-color: inherit;border: 0;}

.confirmbtn{margin:.5rem .4rem .8rem .4rem;height:1.17rem;line-height:1.17rem;border-radius:4px;background-color:#509fff;color:#fff; }

.bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;margin-top:-10px;}
.toumingshade{position:fixed;width:100%;height:100%;top:0;left:0;right:0;z-index: 110;background-color: rgba(0,0,0,0.3)}
.toumingshade img{position: relative;z-index:111;top:5rem;;width:2.4rem;}
</style>