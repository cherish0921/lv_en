<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat" style="text-align:center;">
                <img id="puttycancel" src="../../../../static/images/icon/pic_navb.png" @touchend="goBack" alt="return"> 
                <p>Deposit</p>
            </div>     
        </div>
        <div class="operaddress">
            <div class="address">
                <div class="address-sub">
                    <div id="qrcode"></div>
                    <p>scan the QR code to get the deposit address</p>
                </div>
                <div class="address-sub2">
                    <p >Deposit Address</p>
                    <div class="Depositbox">
                        <div id="addressDeposit" class="Depositbox-address" v-html="queryObj.addr"></div>
                        <span  ref="copyadd1" data-clipboard-action="copy"  data-clipboard-target="#addressDeposit" @touchend="copyOrPasteTxt(1)">Copy</span> 
                    </div>
                </div>
                <div class="address-sub2" style="border-top: 1px solid #e6e6e6;padding-top:.2rem;" v-if="queryObj.opercoincode=='GXS' ||queryObj.opercoincode=='LV'">
                    <p >Memo</p>
                    <div class="Depositbox">
                        <div id="memo" class="Depositbox-address" v-html="queryObj.memo"></div>
                         <span  ref="copyadd2" data-clipboard-action="copy"  data-clipboard-target="#memo" @touchend="copyOrPasteTxt(2)">Copy</span> 
                    </div>
                </div>
                 <div v-show="queryObj.opercoincode=='GXS'||queryObj.opercoincode=='LV'" style="background-color:#f1d4d0;color:red;padding:.4rem;font-size:12px;line-height:12px;;">
                    You must use the destination memo above in you deposit transfer,otherwise it won’t be credited.
                </div>
            </div>
        </div>   
        <div class="tips">
            <p>Tips:</p>
            <p>1.Please do not deposit non {{queryObj.opercoincode}} coins to LendChain which may lead to your asset unaccounted or lost.</p>
            <p>2.Validation of the entire network node is required. Deposit needs  {{queryObj.sure}} network confirmation while withdrawal needs {{queryObj.can}} times network confirmations. </p>
            <p>3.Each deposit must be more than {{queryObj.minr}}&nbsp;{{queryObj.opercoincode}}, otherwise the deposit won't be processed.</p>
            <p>4.Your deposit address will not change frequently. We will inform you by website announcement or email if there is any change.</p>
            <p>5.Please make sure your computer and browser are secure to prevent tampering or leakage of information.</p>
        </div>
   </div>
</template>
<script>
import QRCode from 'qrcodejs2'

export default {
    data() {
        return {
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
            queryObj:this.$route.query //从上一级路由拿到的数据对象
        }
    },
    mounted() {
        //生成二维码
        this.qrcode();    
           this.copyBtn1 = new this.clipboard(this.$refs.copyadd1);
           if(this.queryObj.opercoincode=='GXS' ||this.queryObj.opercoincode=='LV'){
             this.copyBtn2 = new this.clipboard(this.$refs.copyadd2);
           }
          
    },
    methods: {
        copyOrPasteTxt(query){ //num为 1代表复制，2代表粘贴
             let _this = this;
        let clipboard =query==1? _this.copyBtn1:_this.copyBtn2;
            clipboard.on('success', (e) =>{
              this.$toast('Copied')
            });
            clipboard.on('error', function(e) {
                 this.$toast('Copying is not supported on your device, please copy it manually')
            });   
        },
        qrcode () { //生成二维码
            var that = this;
            let qrcode = new QRCode('qrcode', {  
                width: 95,  //宽度
                height: 95, // 高度  
                text: that.queryObj.addr // 二维码内容  
            })  
        },
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped>
#coinoperation{position:absolute;z-index:91;min-height:100%;width:100%;background-image:url('https://s.lendx.vip/images/personnal/module2/bg.png');background-size: cover;overflow:hidden;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;}
.headerline img{position:absolute;left:0;height: 1.17rem;float:left;padding:.4rem;z-index: 99;}
.operaddress,.operanum{text-align:left;padding:0;margin-top:10px;}
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
    padding: .4rem;
    margin-bottom:10px;
    background-color:#fff;
    
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
    padding: .4rem .4rem 0 .4rem;
    background-color:#fff;
}
.address-sub2>p{
    font-size: 12px;
}
.address-sub2 .Depositbox{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.address-sub2 .Depositbox-address{
    width: 8rem;
    height: 1.33rem;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #595959;
    border: 0;
    background: #fff;
    word-break: break-all;
}
.address-sub2>div span{
    position: static;
    color: #262626;
    font-size: 14px;
}
.address-sub2>div span:last-child{
    color: #509fff;
    /* float: right; */
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
