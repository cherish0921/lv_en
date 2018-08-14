<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat" style="text-align:center;">
                <img id="puttycancel" src="../../../../static/images/icon/pic_navb.png" @touchend="hideValid" alt="back"> 
                <p><slot></slot></p>
            </div>     
        </div>
        <form id="my-form-verif" class="form-comm">
            <div>
                <label for="email">Email Code</label>
                <input name="email" id="myEmail" maxlength="4"  type="text" v-model.trim="emailCode" placeholder="Email Code"/>
                <span v-show="!isgetting" @touchend="sendmailcode" style="position: absolute;color:#509fff;right: .4rem;">Send Code</span>
                <span v-show="isgetting" id="Countdownvala" style="position: absolute;color:#999;right: .4rem;">Send Code</span>
            </div>
            <div>
                <label for="nickname">Google Code</label>
                <input name="nickname" v-model.trim="googleCode" maxlength="6" type="text" placeholder="Google Code"/>
            </div>
            <input type="button" value="Confirm" :disabled="disabled" @touchend="VerifProp($event)"/>
        </form>
   </div>
</template>
<script>
import QRCode from 'qrcodejs2'

let endtime=60;
let interval;

export default {
    data() {
        return {
            isgetting:false,//为true表示正在发送验证
            googleCode:'', //谷歌验证码
            emailCode:'',  //手机验证码
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
        }
    },
    props:['disabled','isClear'],
    watch:{
        isClear(newVal,oldVal) {
            if(newVal){
                this.isgetting = false;
                endtime = 60;
                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Send Code"
                clearInterval(interval);
            }
        }
    },
    mounted(){
        let myemail=document.getElementById('myEmail')
        if(myemail) myemail.focus()
    },
    methods: {
        hideValid(){
            if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML ="Send Code";
            this.isgetting = false;
            this.googleCode='';
            this.emailCode='';
            clearInterval(interval);
            this.verification = false;
            this.$emit('hideValid');
        },
        VerifProp(event) { //谷歌和手机验证码页面
            if(event.target.hasAttribute('disabled')){
               return;
            }
            if (!(/^[0-9]{4}$/.test(this.emailCode))) {
                this.$toast('Email code must be four digits');
                return;
            }else if(!(/^[0-9]{6}$/.test(this.googleCode))){
                this.$toast('google code must be six digits');
                return;
            }
            let data = {emailCode:this.emailCode,googleCode:this.googleCode}
            this.$emit('getDate',data);
        },
        sendmailcode(){
            this.$axios.get('/trade/mail/send/me').then( res=> {
                if(Number(res.code)!== 2000){
                    this.$toast(res.message);
                    return;
                }
                this.isgetting=true;
                endtime = 60;
                if(this.isgetting){
                    interval = setInterval(()=> {
                        if (endtime >= 0) {
                            if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML ="Resend code(" + endtime + ")";
                                endtime--;
                            } else {
                                this.isgetting=false;
                                endtime = 60;
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML ="Send Code"
                                clearInterval(interval);
                            }
                        }, 1000)
                    }
            });
        }
    }
}
</script>
<style scoped>
#coinoperation{position:absolute;top:0;z-index:91;height:100%;width:100%;background-image:url('https://s.lendx.vip/images/personnal/module2/bg.png');background-size: cover;overflow:hidden;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;margin-bottom: 10px;font-size:16px;color:#262626;background-color:#fff;border-bottom:1px solid #e6e6e6;}
.headerline img{position:absolute;left:0;height: 1.17rem;float:left;padding:.4rem;z-index: 99;}
.operaddress,.operanum{text-align:left;padding:.4rem;background-color:#fff;margin-top:10px;}
.operaddress>p,.operanum>p{text-align:left;font-size:12px;}
.operanum .fee{padding-top:.4rem;color:#595959;border-top:1px solid #e5e5e5;}
.operaddress>div input,.operanum>div input{width:8rem;height:1.33rem;line-height:1.33rem;font-size:14px;color:#595959;border:0;background: #fff;}
.operaddress>div span,.operanum>div span{position: absolute;line-height:1.33rem;right: .4rem;color:#509fff;font-size:14px;background-color: initial;}
.confirmbtn{text-align:center;line-height: 1.33rem;height: 1.33rem;margin: 0.8rem 1.07rem 1.5rem 1.07rem;font-size: 16px;color: #fff;border-radius: 4px;cursor: pointer;
  background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886ff));-webkit-box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);}
.tips{text-align:left;color:#999;margin:.42rem;}
#gxstip{color:#ff1818;}
.address-sub{
    text-align: center;
}
.address-sub div{
    width:2.6rem;
    height:2.6rem;
    margin: 0 auto .5rem;
}
.address-sub p{
    font-size: 12px;
    color: #999;
}
.address-sub2{
    color: #262626;
    padding-top: 1.5rem;
}
.address-sub2>p{
    font-size: 12px;
}
.address-sub2>div span{
    position: static;
    color: #262626;
    font-size: 14px;
}
.address-sub2>div span:last-child{
    color: #509fff;
    float: right;
}
.tips p{
    font-size: 12px;
    line-height: 18px;
}
.form-comm input{
    outline: none;
    border:0;
    margin-left: 10px;
    font-size: 14px;
    background-color: transparent;
}
.form-comm label{
        display: inline-block;
    width:2.8rem;
    font-size: 14px;
    color: #999;
}
.form-comm strong{
    font-size: 12px;
    font-weight: normal;
    color:#509fff;
}
.form-comm>div{
    height: 1.33rem;
    line-height: 1.33rem;
    text-align: left;
    border-top: 1px solid #e6e6e6;
    padding: 0 .42rem;
    background-color:#fff;
}
.form-comm>div:first-child{
    border-top: 0;
}
.form-comm input[type="button"]{
    display: inline-block;
    width: 9.2rem;
    height: 1.17rem;
    margin: .71rem .42rem 0;
    font-size: 16px;
    color: #fff;
    background-color: #509FFF; 
}
.form-comm .tips{
    margin-top: .8rem;
}
#my-form-verif{
    font-size: 14px;
}
#my-form-verif span{
    color: #509FFF;
    float: right;
}
</style>
