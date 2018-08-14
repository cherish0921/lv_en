<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat" style="text-align:center;">
                <img id="puttycancel" src="../../../../static/images/icon/pic_navb.png" @touchend="goBack" alt="back"> 
                <p>Withdrawal</p>
            </div>     
        </div>
         <p class="bindtip">Tip:the maximum amount of {{queryObj.opercoincode}} for withdrawing within 24 hours is {{compuedmax(this.queryObj.opercoincode)}}</p>
        <div class="operaddress">
            <div class="address">
                <div class="address-sub2">
                    <p >Withdrawal Address</p>
                    <div>
                        <input id="addressWithdraw" type="text" v-model="dizhi" placeholder="15RQLtX6zkiXCJerBYNvMVFA3rH725Gphv"/>
                    </div>
                </div>
            </div>
        </div>   
        <div class="operanum">
            <p>Amount</p>
            <div class="address"><input type="text"  :placeholder="'The minimum number is '+queryObj.minw" v-model="userinput"><span>{{queryObj.opercoincode}}</span></div>
            <p class="fee">Actual arrival:<span style="color:#509fff;">{{daozhang}}</span>&nbsp;{{queryObj.opercoincode}},Withdrawal fee: <span style="color:#509fff;">{{queryObj.fees}}</span>&nbsp;{{queryObj.opercoincode}}</p>   
            <p v-if="queryObj.opercoincode=='GXS'||queryObj.opercoincode=='LV'" style="padding-top: 1rem;">Memo</p>
                <div class="address" v-if="queryObj.opercoincode=='GXS'||queryObj.opercoincode=='LV'">
                    <input type="text" v-model="memo" placeholder="enter memo"/>
                </div>
        </div>
        <div class="confirmbtn" @touchend="confirmBtn()">Confirm</div>
        <GemailValidate v-if="verification" @getDate="getDate($event)" :disabled="disabled" :isClear="isClear" @hideValid="hideValid">Withdrawal verification</GemailValidate>
   </div>
</template>
<script>
import GemailValidate from '@/components/Personnal/Comm/GemailValidate'

export default {
    data() {
        return {
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
            email:'',
            disabled:false, //用于验证码组件按钮的状态
            isClear:false, //是否清除子组件的定时器
            queryObj:this.$route.query, //从上一级路由拿到的数据对象
            limitcanwdval:100000000000000//提现最大额
        }
    },
    computed: {
        daozhang: function() {
            return (Number(this.userinput) >= Number(this.queryObj.fees)) ? (this.LEND.s(Number(this.userinput), Number(this.queryObj.fees))) : 0;
        },
    },
    components:{
        GemailValidate
    },
    mounted(){
        if(this.queryObj.opercoincode=='ETH'){
            document.getElementsByTagName('body')[0].setAttribute('class','ethmessagebox')
        }else{
            document.getElementsByTagName('body')[0].setAttribute('class','')
        }
        if(this.LEND.localStorage('kyc').toString()!='2'){
                this.$MessageBox.confirm('Your kyc should be  successful before you can withdraw,go to check it？',{confirmButtonText:'Confirm',cancelButtonText:'Cancel',closeOnClickModal:false}).then(action => {
                   this.$router.push({ path:'/Safe'})
                    }).catch(error => {
                });
        }
    },
    watch:{
       queryObj:{
           handler(newVal) {
            },
            deep: true
       }
    },
    methods: {
                compuedmax(opercoincode){
            let limitcanwdval
            switch(opercoincode){
  case 'USDT':
                limitcanwdval=80000
                break;
                case  'BTC':
                limitcanwdval=10
                break;
                case 'ETH':
                limitcanwdval=170
                break;
                case 'GXS':
                limitcanwdval=2800
                break;
                case 'LV':
                limitcanwdval=1000000
                break;
                case 'QKC':
                limitcanwdval=100000
                break;
                default:
                 limitcanwdval=100000000000
                 break;
            }
            return limitcanwdval||0;
        },
        hideValid(){
           this.verification = false;
        },
        getDate(data){ //获得组件内传递出来的数据
        console.log(data)
            this.disabled = true;
            this.googleCode = data.googleCode;
            this.emailCode = data.emailCode;
            if(this.googleCode==''||this.emailCode==''){
                this.$toast('you forget enter you google code or email code')
                return;
            }
            this.VerifProp();
        },    
        confirmBtn(){ 
            if(this.LEND.localStorage('kyc').toString()!='2'){
                this.$MessageBox.alert('Your kyc should be  successful before you can withdraw,go to check it？',{title:'Tip',confirmButtonText:'Confirm'}).then(()=>{
                    this.$router.push({ path:'/Safe'})
                    })
                    return false;
            }
            if(/^\d+(\.\d+)?$/.test(Number(this.userinput))){ //限制用户输入6位小数
                if(this.userinput.split('.')[1]&&this.userinput.split('.')[1].length>6){
                    this.$toast('Enter up to 6 decimal places');
                    return;
                }
            }
            if (this.dizhi.toString().length <= 0) {
                this.$toast('Please enter your Withdrawal Address');
                return;
            } else if (Number(this.userinput) < Number(this.queryObj.minw)) {
                this.$toast('Amount can not be less than minimum number');
                return;
            } else if (Number(this.userinput) > Number(this.queryObj.maxAmount)) {
                this.$toast('Insufficient balance');
                return;
            } else if (isNaN(this.userinput)) {
                this.$toast('Amount should be a number');
                return;
            } else if(/.*[\u4e00-\u9fa5]+.*$/.test(this.dizhi)){
                this.$toast('Withdrawal Address cannot be empty');
                return;
            }
            if(this.userinput.indexOf(".")!=-1){
                if((this.userinput.toString().split(".")[1].length)>5 && (this.queryObj.opercoincode=='GXS' || this.queryObj.opercoincode=='LV')){
                this.$toast('The number of digits for withdrawal can not exceed 5 digits');
                return;
               }
            }
            if(this.userinput>this.compuedmax(this.queryObj.opercoincode)){ //大于2000的时候需要一个确认弹窗
                this.isContinue = false;
                this.$MessageBox.confirm('The withdrawal amount is too large and needs to wait for manual review. Unless you want to continue withdrawal?',{confirmButtonText:'Confirm',cancelButtonText:'Cancel'}).then(action => {
                    var hasIphone = parseInt(this.LEND.localStorage('iphone'));
                    var hasIgoogle = parseInt(this.LEND.localStorage('igoogle'));
                    if (!hasIphone || !hasIgoogle) {
                        this.$router.push({name: 'Safe',query: {redirect: this.$route.fullPath}});
                        return;
                    } else {
                        this.verification = true;
                    }
                }).catch(error => {
                });
            }else{   
                var hasIphone = parseInt(this.LEND.localStorage('iphone'));
                var hasIgoogle = parseInt(this.LEND.localStorage('igoogle'));
                if (!hasIphone || !hasIgoogle) {
                    this.$router.push({name: 'Safe',query: {redirect: this.$route.fullPath}});
                    return;
                } else {
                    this.verification = true;
                }    
            }
        },
        VerifProp() { //谷歌和邮箱验证码页面
            let formData = {
                    access_token: this.access_token,
                    googleCode: this.googleCode,
                    emailCode: this.emailCode,
                    amount: this.userinput,
                    address: this.dizhi,
                    assetId: this.queryObj.aid,
                    memo:this.memo
            }
            this.$axios.post('/trade/withdraw/create', formData).then(result => {
                if (Number(result.code) !== 2000) {
                    this.$toast(result.message);
                    this.disabled = false;
                    return;
                } else {
                    this.isClear = true;
                    setTimeout(()=>{  //做一个延迟不然子组件监听不到isClear的值
                        this.$toast('success');
                        this.verification = false; //成功才隐藏验证页面
                        this.disabled = false;
                        this.$router.replace({path:'/Wallet'});
                    },20);
                }
            }).catch(()=>{
                 this.disabled = false;
                 this.$toast('net error');
            });
        },
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped>
.bindtip{
    width: 100%;
    height: 1.07rem;
    box-sizing: border-box;
    padding: 0px 0.26rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #509fff;
    background-color: #ebf4ff;
    margin-top: -10px;
}
#coinoperation{position:absolute;z-index:91;width:100%;height:100%;background-image:url('https://s.lendx.vip/images/personnal/module2/bg.png');background-size: cover;overflow:hidden;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;}
.headerline img{position:absolute;left:0;height: 1.17rem;float:left;padding:.4rem;z-index: 50;}
.operaddress,.operanum{text-align:left;padding:.4rem;background-color:#fff;margin-top:10px;}
.operaddress>p,.operanum>p{text-align:left;font-size:12px;}
.operanum .fee{padding-top:.4rem;color:#595959;border-top:1px solid #e5e5e5;}
.operaddress>div input,.operanum>div input{width:8rem;height:1.33rem;line-height:1.33rem;font-size:14px;color:#595959;border:0;background: #fff;}
.operaddress>div span,.operanum>div span{position: absolute;line-height:1.33rem;right: .4rem;color:#509fff;font-size:14px;background-color: initial;}
.confirmbtn{text-align:center;line-height: 1.33rem;height: 1.33rem;margin: 0.8rem .4rem 1.5rem .4rem;font-size: 16px;color: #fff;border-radius: 4px;cursor: pointer;
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
    padding-top: .4rem;
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
.operaddress{padding:0 .4rem;}
</style>
<style>
.ethmessagebox .mint-msgbox{top:30%;}
</style>