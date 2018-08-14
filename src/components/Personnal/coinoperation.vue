<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat" style="text-align:center;">
                <img id="puttycancel" src="../../../static/images/icon/pic_navb.png" @touchend.stop="puttytoggle" alt="返回"> 
                <p v-if="operName=='deposit'">充值</p>
                <p v-if="operName=='withdraw'&& !verification">提现</p>
                <p v-if="operName=='transfer'&& !verification">平台内转账</p>
                <p v-if="verification">{{operName=='withdraw'?'提现':'转账'}}验证</p>
            </div>     
        </div>
        <div class="operaddress" v-if="operName!='transfer' && !verification">
            <div class="address">
                <div class="address-sub" v-if="operName=='deposit'">
                    <div id="qrcode"></div>
                    <p>扫一扫二维码，获取充值码地址</p>
                </div>
                <div class="address-sub2">
                    <p >{{operName=='deposit'?'充值':'提币'}}地址</p>
                    <div>
                        <input v-if="operName=='deposit'" id="addressDeposit" type="text" :value="depositaddr.address" readonly/>
                        <input v-if="operName=='withdraw'" id="addressWithdraw" type="text" v-model="dizhi" placeholder="15RQLtX6zkiXCJerBYNvMVFA3rH725Gphv"/>
                        <!-- <span v-if="operName=='deposit'" @touchend="copyOrPasteTxt(1,'addressDeposit')">复制</span> -->
                        <!-- <span v-if="operName=='withdraw'" @touchend="copyOrPasteTxt(2)">粘贴</span> -->
                    </div>
                    <p v-if="operName=='withdraw' && (opercoincode=='GXS'||opercoincode=='LV')" style="padding-top: .5rem;">memo:</p>
                    <div class="address" v-if="operName=='withdraw' && (opercoincode=='GXS'||opercoincode=='LV')">
                        <input type="text" v-model="memo" placeholder="请输入memo"/>
                    </div>
                </div>
                <div class="address-sub2" style="padding-top:.2rem;" v-if="operName=='deposit' && (opercoincode=='GXS' ||opercoincode=='LV')">
                    <p >memo地址</p>
                    <div>
                        <input id="memo" type="text" :value="depositaddr.memo" readonly/>
                        <!-- <span @touchend="copyOrPasteTxt(1,'memo')">复制</span> -->
                    </div>
                </div>
            </div>
        </div>   
        <div class="operanum" v-if="operName=='withdraw' && !verification">
            <p>数量</p>
            
            <div class="address"><input type="text"  :placeholder="'最小数量为'+min" v-model="userinput"><span>{{opercoincode}}</span></div>
            <p class="fee">实际到账：<span style="color:#509fff;">{{daozhang}}</span>&nbsp;{{opercoincode}},手续费<span style="color:#509fff;">{{fees}}</span>&nbsp;{{opercoincode}}</p>   
        </div>
        <div v-if="operName=='withdraw' && !verification" class="confirmbtn"  @touchend="confirmBtn(operName)">确认提现</div>
        <div  v-if="operName!='transfer' && !verification" class="tips">
            <p>温馨提醒：</p>
            <p v-if="operName=='deposit'&& (opercoincode=='GXS'||opercoincode=='LV')" id="gxstip"> 地址和memo同时使用才能充值{{opercoincode}}到LendChain</p>
            <p>1.请勿向上述地址充值任何非{{opercoincode}}资产，否则资产将不可找回。</p>
            <p>2.您充值至上述地址后，需要整个网络节点的确认，{{sure}}次网络确认后到账，{{can}}次网络确认后可提币。</p>
            <p>3.最小充值金额：{{min}}{{opercoincode}} ，小于最小金额的充值将不会上账。</p>
            <p>4.您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</p>
            <p>5.请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
        </div>
        <div v-if="operName=='transfer' && !verification">
            <form id="my-form" class="form-comm">
                <div>
                    <label for="email">收款账户邮箱</label>
                    <input name="email" type="text" v-model="email" placeholder="请输入收款账户邮箱" />
                </div>
                <div>
                    <label for="nickname">昵称 <strong>( 选填 )</strong></label>
                    <input name="nickname" v-model="nickname" type="text" placeholder="请输入收款人昵称"/>
                </div>
                <div>
                    <label for="phone">手机号 <strong>( 选填 )</strong></label>
                    <input name="phone" type="text" v-model="phone" placeholder="请输入手机号"/>
                </div>
                <div>
                    <label for="allmount">转账数量</label>
                    <input name="allmount" type="text" placeholder="请输入转账数量" v-model="amount"/>
                    <span style="float: right;font-size: 14px;">{{opercoincode}}</span>
                </div>
                <input type="button" value="确认转账" @touchend="confirmBtn(operName)"/>
            </form>
            <div class="tips">
                <p>温馨提醒：</p>
                <p>1.平台内转账 0 手续费。</p>
                <p>2.平台内转账后立即到账。</p>
            </div>    
        </div>
        <form id="my-form-verif" class="form-comm" v-if="verification">
            <div>
                <label for="email">邮箱验证码</label>
                <input name="email" type="text" v-model.trim="emailCode" placeholder="请输入邮箱验证码"/>
                <span v-show="!isgetting" @touchend="sendmailcode" style="position: absolute;color:#509fff;right: .4rem;">发送验证码</span>
                <span v-show="isgetting" id="Countdownvala" style="position: absolute;color:#999;right: .4rem;">发送验证码</span>
            </div>
            <div>
                <label for="nickname">谷歌验证码</label>
                <input name="nickname" v-model.trim="googleCode" type="text" placeholder="请输入谷歌验证码"/>
                <!-- <span @touchend="copyOrPasteTxt(2)">粘贴</span> -->
            </div>
            <input type="button" value="确认" @touchend="VerifProp(operName)"/>
        </form>
   </div>
</template>
<script>
import QRCode from 'qrcodejs2'

let endtime=60;
let interval;
let ajax = false; //防止重复点击

export default {
    data() {
        return {
            isgetting:false,//为true表示正在发送验证
            userinput:'', //提币数量
            dizhi:'',  //提现地址
            memo:'', //备注
            googleCode:'', //谷歌验证码
            emailCode:'',  //手机验证码
            verification:false, //默认不显示验证页面
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
            amount:'',
            phone:'',
            nickname:'',
            email:''
        }
    },
    props: ["aid","depositaddr","fees","operName","opercoincode","min","sure","can","maxAmount"],
    computed: {
        daozhang: function() {
            return (Number(this.userinput) >= Number(this.fees)) ? (this.LEND.s(Number(this.userinput), Number(this.fees))) : 0;
        }
    },
    mounted() {
        if(this.operName=='deposit'){ //如果是充值就去生成二维码
            this.qrcode();    
        }
    },
    methods: {
        confirmBtn(operName){
            if(operName=='withdraw'){ //提现
                if (this.dizhi.toString().length <= 0) {
                    this.$toast('请先输入提币地址');
                    return;
                } else if (Number(this.userinput) < Number(this.minw)) {
                    this.$toast('不能小于最小提现额度');
                    return;
                } else if(Number(this.userinput) > Number(this.maxAmount)){
                    this.$toast('余额不足');
                    return;
                }else if(isNaN(this.userinput)){
                    this.$toast('提现金额必须是数字');
                    return;
                }
            }else if(operName=='transfer'){   //转账
                if(!this.LEND.checkMail(this.email) || Number(this.amount <= 0)){
                    this.$toast('邮箱输入有误或转账额度不能为空'); 
                    return;
                }else if(Number(this.amount) > Number(this.maxAmount)){
                    this.$toast('余额不足'); 
                    return;
                }else if(isNaN(this.userinput)){
                    this.$toast('转账金额必须是数字');
                    return;
                }else if(this.phone){
                    if (!this.LEND.checkMobile(this.phone)) {
                        this.$toast('手机号有误');
                        return;
                    }
                }
            }
            var hasIphone = parseInt(this.LEND.localStorage('iphone'));
            var hasIgoogle = parseInt(this.LEND.localStorage('igoogle'));
            if (!hasIphone || !hasIgoogle) {
                this.$router.push({name: 'Safe',query: {redirect: this.$route.fullPath}});
                return;
            }else{
                this.verification = true;
            }
        },
        VerifProp(operName) { //谷歌和手机验证码页面

            if (!(/^[0-9]{4}$/.test(this.emailCode))) {
                this.$toast('验证码必须是4位数字');
                return;
            }else if(!(/^[0-9]{6}$/.test(this.googleCode))){
                this.$toast('谷歌验证码必须是6位数字');
                return;
            }
            if(ajax){
                return;    
            }
            let url = operName == 'withdraw'?'/trade/withdraw/create':'/trade/asset/transfer';
            let formData = {};
            if(operName=='withdraw'){
                formData = {
                    access_token: this.access_token,
                    googleCode: this.googleCode,
                    emailCode: this.emailCode,
                    amount: this.userinput,
                    address: this.dizhi,
                    assetId: this.aid,
                    memo:this.memo
                }
            }else if(operName=='transfer'){
                formData = {
                    cryptoId: this.aid,
                    cryptoCode: this.opercoincode,
                    nickname: this.nickname,
                    email: this.email,
                    phone: this.phone,
                    amount: this.amount,
                    access_token: this.access_token,
                    googleCode: this.googleCode,
                    emailCode: this.emailCode,
                }
            }
            ajax = true;
            this.$axios.post(url, formData).then(result => {
                if (Number(result.code) !== 2000) {
                    ajax = false;
                    this.$toast(result.message);
                    return;
                } else {
                    if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "发送验证码";
                    this.$toast('操作成功');
                    this.isgetting = false;
                    clearInterval(interval);
                    this.verification = false;
                    setTimeout(()=>{
                        ajax = false;
                    },2000)
                }
            }).catch((err) => {
                ajax = false;

            });
        },
        copyOrPasteTxt(num,ele){ //num为 1代表复制，2代表粘贴
            if(num===1){
                let addressDeposit = document.getElementById(ele);
                if(this.LEND.fastCopy(addressDeposit)){
                    this.$toast('复制成功');
                }
            }
            // else{
                
                // let addressWithdraw = document.getElementById('addressWithdraw');  
                // window.clipboardData.getData('Text'); 
                // if(!this.LEND.fastpaste){
                //     this.$toast('无可粘贴内容');    
                // }else{
                //     addressWithdraw.value = this.LEND.fastpaste;    
                // }
            // }
        },
        qrcode () { //生成二维码
            var that = this;
            let qrcode = new QRCode('qrcode', {  
                width: 95,  //宽度
                height: 95, // 高度  
                text: that.depositaddr.address // 二维码内容  
            })  
        },
        sendmailcode(){
            this.$axios.get('/trade/mail/send/me').then( res=> {
                if(Number(res.code)!== 2000){
                    this.$toast(res.message);
                    return;
                }
                this.$data.isgetting=true;
                endtime = 60;
                if(this.$data.isgetting){
                    interval = setInterval(()=> {
                        if (endtime >= 0) {
                            if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML ="重新发送(" + endtime + ")";
                                endtime--;
                            } else {
                                this.$data.isgetting=false;
                                endtime = 60;
                                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML ="发送验证码"
                                clearInterval(interval);
                            }
                        }, 1000)
                    }
            });
        },
        puttytoggle(e){
            if(this.verification){
                if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML ="发送验证码";
                this.isgetting = false;
                clearInterval(interval);
                this.verification = false;
            }else{
                this.$emit('cancelputty');    
            }
        }
    }
}
</script>
<style scoped>
#coinoperation{position:absolute;z-index:91;height:100%;width:100%;background-image:url('https://s.lendx.vip/images/personnal/module2/bg.png');background-size: cover;overflow:hidden;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;}
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
    border-top: 1px solid #eee;
    padding: 0 .42rem;
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
