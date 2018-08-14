<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat">
                <img id="puttycancel" src="../../../../static/images/icon/pic_navb.png" @touchend.stop="puttytoggle" alt="返回"> 
                <p  style=" text-align:center;">充值</p>
            </div>     
        </div>
        <div class="operaddress">
            <div class="address">
                <div class="address-sub">
                    <div id="qrcode"></div>
                    <p>扫一扫二维码，获取充值码地址</p>
                </div>
                <div class="address-sub2">
                    <p style="">充值地址</p>
                    <div>
                        <input id="addressDeposit" type="text"  :value="addr" readonly/>
                        <span  ref="copy1" data-clipboard-action="copy"  data-clipboard-target="#addressDeposit" @touchend="copyOrPasteTxt(1)">复制</span>
                    </div>
                </div>
                <div class="address-sub2" style="padding-top:.2rem;" v-if="memo">
                    <p >备注（Memo）</p>
                    <div>
                        <input id="memo" type="text" :value="memo" readonly/>
                        <span  ref="copy2" data-clipboard-action="copy"  data-clipboard-target="#memo" @touchend="copyOrPasteTxt(2)">复制</span> 
                    </div>
                </div>
            </div>
        </div>   
        <div class="tips">
            <p>温馨提醒：</p>
            <p v-if="borrowitem.mortgageCryptoCode=='GXS'" id="gxstip"> 地址和memo同时使用才能充值GXS到LendChain</p>
            <p>1.请勿向上述地址充值任何非{{borrowitem.mortgageCryptoCode}}资产，否则资产将不可找回。</p>
            <p>2.您充值至上述地址后，需要整个网络节点的确认，{{sure}}次网络确认后到账，{{can}}次网络确认后可提币。</p>
            <p>3.最小充值金额：{{min}}{{borrowitem.mortgageCryptoCode}} ，小于最小金额的充值将不会上账。</p>
            <p>4.您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</p>
            <p>5.请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'

let endtime=60;
let interval;

export default {
    data() {
        return {
            addr:'',
            min:'',
            sure:'',
            can:'',
            memo:'',  //备注
            access_token: this.LEND.localStorage('access_token'),
        }
    },
    props: ['borrowitem'],
    created(){
        switch(this.borrowitem.mortgageCryptoCode){
            case 'USDT':
            this.min=100
            this.sure=1
            this.can=6
            break;
            case 'GXS':
            this.min=10
            this.sure=0
            this.can=0
            break;
            case 'ETH':
            this.min=0.01
            this.sure=15
            this.can=30
            break;
            case 'BTC':
            this.min=0.001
            this.sure=1
            this.can=6
            break;
            case 'LV':
            this.min=100
            this.sure=1
            this.can=6
            break;
            case 'QKC':
            this.min=75
            this.sure=15
            this.can=30
            break;
            default:
            this.min=0
            this.sure=0
            this.can=0
            break;
        }
        this.$axios.get('/trade/deposit/address',{params:{cryptoId:this.borrowitem.mortgageCryptoId}}).then((res) => {
            if (Number(res.code == 2000)) {
                this.addr = res.data.master.addr;
                this.memo = res.data.master.memo;
                this.qrcode();
            } else {
                this.$toast(res.message);
            }
        })
    },
    methods: {
        copyOrPasteTxt(num) { 
            let clipboard = num==1?new this.clipboard(this.$refs.copy1):new this.clipboard(this.$refs.copy2);
            clipboard.on('success', () =>{
              this.$toast('successful copy')
            });
            clipboard.on('error', function() {
                 this.$toast('Copying is not supported on your device, please copy it manually')
            });  
        },
        qrcode() { //生成二维码
            var that = this;
            let qrcode = new QRCode('qrcode', {
                width: 95, //宽度
                height: 95, // 高度  
                text: that.addr // 二维码内容  
            })
        },
        puttytoggle(e) {
            this.$emit('cancelputty');
        }
    }
}
</script>
<style scoped>
#coinoperation{position:fixed;z-index:91;top:0;height:100%;width:100%;background-image:url('https://s.lendx.vip/images/personnal/module2/bg.png');background-size: cover;overflow:hidden;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;}
.headerline img{position:absolute;left:0;height: 1.17rem;     position: absolute;padding: 0.4rem;;z-index: 99;}
.operaddress,.operanum{text-align:left;padding:.4rem;background-color:#fff;margin-top:10px;}
.operaddress>p,.operanum>p{text-align:left;font-size:12px;}
.operanum .fee{padding-top:.4rem;color:#595959;border-top:1px solid #e5e5e5;}
.operaddress>div input,.operanum>div input{width:8rem;height:1.33rem;line-height:1.33rem;font-size:14px;color:#595959;border:0;background: #fff;}
.operaddress>div span,.operanum>div span{position: absolute;line-height:1.33rem;right: .4rem;color:#509fff;font-size:14px;background-color: initial;}
.confirmbtn{line-height: 1.33rem;height: 1.33rem;margin: 0.8rem 1.07rem 1.5rem 1.07rem;font-size: 16px;color: #fff;border-radius: 4px;cursor: pointer;
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
