<template>
  <div class="shadebg">
    <transition name="lendchainfade1">
        <div>
            <header class="clearfloat">
                <img @touchend="goBack" src="../../../../static/images/icon/pic_navb.png" alt="返回">
               <slot></slot>
            </header>
           <div class="content_gauth contry" v-if="verifyType==1">
                <div class="gcode clearfloat">
                        <span>Country</span>
                        <div class="countrycode">
                            <contryCode :countryCode="countryCode" @excountry="excountry"></contryCode>
                        </div>
                </div>
           </div>
            <div class="content_gauth" v-if="verifyType==1">
                <div class="gcode clearfloat">
                    <span>Phone Number</span>
                    <input type="number" v-model="b_phone"  placeholder="Phone Number">
                </div>
                <div class="gcode clearfloat">
                    <span>SMS Code</span>
                    <input type="number" v-model.trim="b_pcode"  style="width:4.6rem;" placeholder="Enter SMS code">
                    <span v-show="!isgetting" style="position:absolute;right:.4rem;color:#509fff;" @touchend="sendcode">Send SMS</span>
                    <span v-show="isgetting" style="position:absolute;right:.4rem;color:#999;" id="Countdownvala">Send SMS</span>
                </div>
            </div>
            <div v-if="verifyType==2" style="margin-top:1.4rem;">
                <div>
                    <p class="bindtip">Tips: Remember to back up Google QR code or key</p>
                    <!-- <div class="googlearea">
                        <p>Google QR Code & Private Key:</p>
                        <div class="">
                            <span id="qrcode"></span>
                            <span style="padding-left:0"><input id="qrcodeTxt" readonly  type="text" :value="googleSecret"></span>
                             <span class="active" ref="copy" data-clipboard-action="copy"  data-clipboard-target="#qrcodeTxt" @touchend="copyTxt(1)">Copy</span>
                        </div>
                    </div> -->
                </div>
                <div class="newgooglearea">
                    <p>Google QR Code & Private Key:</p>
                    <div class="googleareabox">
                        <div class="qrcodebox">
                            <span id="qrcode"></span>
                        </div>
                        <div class="qrcodeTxt"><span id="qrcodeTxt" v-html="googleSecret"></span></div>
                        <div class="qrcodetxtcopy"><span ref="copy" data-clipboard-action="copy"  data-clipboard-target="#qrcodeTxt" @touchend="copyTxt(1)">Copy</span></div>
                    </div>
                </div>
                <div class="content_gauth newcontent_gauth">
                    <!-- <div class="gcode clearfloat">
                        <span>Google code</span>
                        <input type="text" v-model="gcode"  placeholder="Enter Google code">
                    </div> -->
                    <div class="gcode clearfloat"  style="clear:both;">
                        <span>SMS Code</span>
                        <input type="text" v-model="phonecode"  placeholder="Enter SMS code">
                        <span class="active" v-show="!isgetting"  @touchend="sendcode">Send SMS</span> 
                        <span style="color:#999;position:absolute;right:.4rem;z-index:1000;" v-show="isgetting"  id="Countdownvala">Send SMS</span> 
                    </div>
                    <div class="gcode clearfloat">
                        <span>Google code</span>
                        <input type="text" v-model="gcode"  placeholder="Enter Google code">
                    </div>
                </div>
                <div class="intru">
                    <p class="font12">
                        Steps:<br>
                        1.iOS users download "google authenticator" from the app store, and Android users download "Google authenticator" in the play store or Google search
                    </p>
                    <p class="font12">
                    2. In the "Google Authenticator" application, click on the "+" sign in the upper right corner and select "Manually enter verification code"
                    </p>
                    <p class="font12">
                    3.Copy "Google Verification Code" and paste it into the "Google Verification Code" input field above. Do not delete this double verification password account, otherwise you will be unable to perform account operations; if you delete it by mistake, you can retrieve it again by resetting the key.
                    </p>
                    <p class="font12">
                    4.Please keep your key in a safe place. In the event that your mobile phone is lost, you can use this key to restore your Google verification.
                    </p>
                </div>
            </div>
             
            <div class="confirmbtn" @touchend="confirm">Confirm</div>
        </div>
    </transition>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import QRCode from 'qrcodejs2'
import contryCode from '../../../components/common/IntlTelInput/index'
let endtime = 60;
let interval;

export default {
    data() {
        return {
            gcode: '',  //谷歌验证码    前面两个参数用于谷歌认证使用
            phonecode:'', //短信验证码
            b_phone: '', //手机号码  后面两个参数用于手机认证使用
            b_pcode: '', //手机验证码
            isgetting: false, 
            googleSecret:'', //谷歌秘钥    后面两个参数用于谷歌秘钥的生成
            email:'', //秘钥接口返回的邮箱
            countryCode:'kr',//国别码
            countrynum:82,
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
            redirect: this.$route.query.redirect //拿到上级路由传过来的地址，用于登录后的重定向
        }
    },
    props: ['verifyType'],
    components:{contryCode},
    created() {
        if(this.verifyType==2){  //如果是谷歌认证则先获取秘钥
            this.$axios.get('/trade/mfa/generate').then(res => {
                if (Number(res.code) !== 2000) {
                    this.$toast(res.message.toString());
                } else {
                    this.googleSecret = res.data.secret;
                    this.email = res.data.email;
                    this.qrcode();
                }
            });
        }
    },
    mounted(){
        if(this.verifyType=='2'){
         this.copyBtngv = new this.clipboard(this.$refs.copy);
        }
       
    },
    methods: {
        excountry:function(item){
            this.countrynum=item.dialCode
        },
        ...mapActions(['changeState']), 
        copyTxt(query){ //num为 1代表复制，2代表粘贴
            let clipboard =this.copyBtngv;
            clipboard.on('success', (e) =>{
              this.$toast('Copied successfully')
            });
            clipboard.on('error', function(e) {
                this.$toast('This environment does not support fast copying, please manually select again')
            });  
        },
        qrcode() { //生成二维码
            let that = this;
            let qrcode = new QRCode('qrcode', {
                width: 80, //宽度
                height: 80, // 高度  
                text: `otpauth://totp/${this.email}?secret=${this.googleSecret}&issuer=lendx.vip` // 二维码内容  
            })
        },
        goBack() {
            this.$emit('hideVerify');
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
                        ele.innerHTML = "Resend code(" + endtime + ")";
                        endtime--;
                    } else {
                        this.isgetting = false;
                        endtime = 60;
                        ele.innerHTML = "Send code"
                        clearInterval(interval);
                    }
                }, 1000)
            }
        },
        sendcode() {
            let url = this.verifyType==1?'/trade/sms/send-code':'/trade/sms/send';
            if(this.verifyType==1){ //手机认证需要验证手机
                if (!this.LEND.checkMobile(this.b_phone)) {
                    this.$toast('phone number format input error, please enter again');
                    return;
                }
            }
            let formDate = {};
            if(this.verifyType==1){
                formDate = {
                    countryCode: this.countrynum,
                    phone: this.b_phone,
                    access_token: this.access_token,
                }
            }else{
                formDate = {
                    access_token: this.access_token
                }
            }
            this.$axios.post(url, formDate).then(res => {
                let ele = document.getElementById('Countdownvala');
                this.sendCommMal(res, ele);
            });
        },
        confirm() {
            if (this.verifyType == 1) { //手机认证
                if (this.$data.b_phone <= 0) {
                    this.$toast('you should enter your phone number')
                    return ;
                } else if (this.b_pcode <= 0) {
                    this.$toast('you should enter your verify code')
                    return ;
                } else if (!(/^[0-9]{4}$/.test(this.b_pcode))) {
                    this.$toast('SMS verification code must be four digits');
                    return;
                } else {
                    this.$axios.post("/trade/sms/auth-phone", {
                        countryCode: this.countrynum,
                        phone: this.b_phone,
                        code: this.b_pcode,
                        access_token: this.access_token
                    }).then((res) => {
                        switch (Number(res.code)) {
                            case 2000:
                                this.LEND.localStorage('phone',this.b_phone);
                                this.$toast("Successfully phone verify");
                                this.b_phone = '';
                                this.b_pcode = '';
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Send email";
                                this.isgetting = false;
                                clearInterval(interval);
                                this.activePhone = this.LEND.localStorage('iphone', 1);
                                this.$emit('hideVerify');
                                break;
                            default:
                                this.$toast(res.message.toString());
                                break;
                        }
                    })
                }
            }else if(this.verifyType == 2){   //谷歌认证
             if (!(/^[0-9]{4}$/.test(this.phonecode))) {
                    this.$toast('SMS verification code must be four digits');
                    return;
                }else if(!this.gcode){
                     this.$toast('you must enter you google code');
                    return;
                }
                this.$axios.post("/trade/mfa/auth", {
                    google_code: this.gcode,
                    sms_code: this.phonecode,
                    access_token: this.access_token
                }).then((res) => {
                    switch (Number(res.code)) {
                        case 2000:
                            {
                                this.$toast('Google certification success');
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Send Code"
                                clearInterval(interval);
                                this.isgetting = false;
                                this.activePhone = this.LEND.localStorage('igoogle', 1);
                                if (this.redirect) { //存在就重定向回原来的路由
                                    this.$router.replace({
                                        path: this.redirect
                                    });
                                } else { //不存在就隐藏弹窗
                                    this.$emit('hideVerify');
                                }
                                break;
                            }
                        default:
                            {
                                this.$toast(res.message);
                            }
                    }
                });
            }
        }
    }
}
</script>

<style scoped>
.shadebg{position: absolute;;width: 100%;min-height:100%;top:0;left:0;right:0;z-index:100;background-color:#f5f5f5;}
header{position:fixed;width:100%;top:0;margin-bottom:.28rem;height:1.17rem;line-height:1.17rem;font-size: 16px;color:#000;background-color: #fff;box-shadow:1px 0px 0px rgba(0,0,0,0.1)}
header img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;;float:left;}
header span{line-height: 1.17rem;height:1.17rem;}
.bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;margin-top:-10px;}
.toumingshade{position:fixed;width:100%;height:100%;top:0;left:0;right:0;z-index: 110;background-color: rgba(0,0,0,0.3)}
.toumingshade img{position: relative;z-index:111;top:5rem;;width:2.4rem;}
.content_gauth{text-align: left;}
.content_gauth >div>span{display: inline-block;}
.content_gauth >div>span:first-child{width: 3.4rem;text-align: left;padding-left: .4rem;color:#999;}
.content_gauth >div>span:last-child{float: right;text-align: right;padding-right:0;}
.content_gauth .gtext,.content_gauth .gcode{height:1.33rem;line-height:1.33rem;font-size: 14px;background-color: #fff;}
.content_gauth .gcode:nth-child(2){border-top:.5px solid #e6e6e6;}
.content_gauth .gtext{border-bottom:1px solid #e6e6e6;}
.content_gauth .gtext input,.content_gauth .gcode input{font-size: 16px;background-color: inherit;border: 0;}
.intru{color:#999;font-size: 12px;text-align: left;margin-top: .55rem;padding:0 .4rem;}
.confirmbtn{margin:.5rem .4rem .8rem .4rem;height:1.17rem;line-height:1.17rem;border-radius:4px;background-color:#509fff;color:#fff;font-size:16px; }

.googlearea {padding:.4rem;text-align:left;background-color:#fff;margin-bottom:10px;margin-top:10px;}
.googlearea p{height:1.16rem;line-height:1.16rem;font-size:14px;color:#999;}
.googlearea div,.googlearea div img{height:2.13rem;line-height:2.13rem;vertical-align: middle;font-size:16px;color:#262626;}
.googlearea div .active,.content_gauth  .active{position: absolute;color:#509fff;right:.4rem;}
#qrcode{
    display: inline-block;
    vertical-align: middle;
}
#qrcodeTxt{
    outline: none;
    border:0;
    font-size: 16px;
    color: #262626;
    line-height: 2.13rem;
    margin-left: 1.5rem;
}
.contry{margin-top:1.4rem;border-bottom: .5px solid #e6e6e6;}
.contry div span{position: absolute;display: inline-block; width: 2rem; font-size: 14px; color: #999; text-align: left;}
.contry div>.countrycode{padding-right: .4rem;height: 1.3rem;line-height: 1.3rem;font-size: 14px;margin-top: 10px;background-color: #fff;text-align: left;margin-left: 2rem;}
/*新增谷歌二维码及密钥*/
.newgooglearea{
    display:flex;
    flex-direction: column;
    padding:0.4rem;
    width:100%;
    box-sizing: border-box;
    background-color: #FFFFFF;
}
.newgooglearea p{
    width:100%;
    text-align: left;
    font-size: 0.37rem;
    color:#999999;
    line-height: 0.4rem;
    margin-bottom: 0.39rem;
    font-weight: 400;
}
.googleareabox{
    width: 100%;
    padding-right: 0.65rem;
    display:flex;
    align-items: center;
    justify-content: space-between;
}
.googleareabox .qrcodebox{
    width: 2.13rem;
    height: 2.13rem;
}
.googleareabox #qrcode img{
    width:100%;
    height:100%;
}
.googleareabox .qrcodeTxt{
    flex:1;
    padding-left:0.78rem;
    display:flex;
    justify-content: flex-start;
}
.googleareabox #qrcodeTxt{
    margin-left: 0px;
    line-height: normal;
    font-size: 0.43rem;
    color: #262626;
}
.googleareabox .qrcodetxtcopy span{
    font-size: 0.37rem;
    color: #509FFF;
    font-weight: 400;
}
.newcontent_gauth{margin-top: 0.27rem;}
</style>