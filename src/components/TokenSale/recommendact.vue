<template>
    <div id="gift">
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../static/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                <p>Villa by the Sea</p>
            </div> 
        </div>
        <img id="headbanner" src="https://s.lendx.vip/static/en/images/tokensale/khactivityhdbanber.png" alt="">        
        <div class="recommandsquire myrecommand">
            <div class="squireimg">My Suggestions</div>
            <div class="pipes clearfloat">
                <div class=" haf_pipes">
                    <p>My referral ID:</p>
                    <div>
                        <input type="text" readonly :value="invitercode" id="invitationid">
                         <span  ref="copy" data-clipboard-action="copy"  data-clipboard-target="#invitationid" @touchend="copyTxt(1)">Copy</span>
                    </div>
                </div>
                <div class=" haf_pipes">
                    <p>QR code:</p>
                    <div id="qrcode"> </div>
                </div>
            </div>
            <div class="investlink">
                <p>My referral link:</p>
                <div><input type="text" readonly :value="inviterurl" id="invitationlink">
                <span  ref="copy2" data-clipboard-action="copy"  data-clipboard-target="#invitationlink" @touchend="copyTxt(2)">Copy</span>
                </div>
            </div>
        </div> 
        <div class="recommandsquire myrecommandlist">
            <div class="squireimg">
            Reward Record
            </div>
            <div class="mybonusbox">
                <div class="mybonus-container">
                    <div class="mybonus-list mybonus-title">
                        <div class="mybonus-subtit">Reward record</div>
                        <div class="mybonus-subtit">Reward amount</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit">Certification</div>
                        <div class="mybonus-subtit">{{myAuthAmount}}LV</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit smalltit">
                            <span>Investment of </span>
                            <span>new users</span>
                        </div>
                        <div class="mybonus-subtit">{{authAmount}}LV</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit">Invited new users</div>
                        <div class="mybonus-subtit">{{inviternumber}}LV</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit">Investment</div>
                        <div class="mybonus-subtit">{{inviteramount}}LV</div>
                    </div>
                </div>
            </div>
        </div> 
        <div class="recommandsquire myrecommandrule">
            <div class="squireimg">Activity Details</div>
            <div class="rules">
                <p>1.New user completes the certification (excluding KYC) and will receive 80 LVCOIN.</p>
                <p>2.The user you invited completes the certification (excluding KYC),and  you will receive 40 LVCOIN, the maximum limit is 400 LVCOIN.</p>
                <p>3.Your investment in BTC/ETH/USDT will be rewarded according to the amount of investment. If you invest 1 BTC, you will get 2800 LVCOIN; if you invest 1 ETH, you will get 160 LVCOIN; if you invest 3 USDT, you will get 1 LVCOIN. </p>
                <p>4.If you invite users to invest in BTC/ETH/USDT, you will receive 30% of their investment reward. For example, if you invite users to invest in 1 BTC, you will receive 840 LVCOIN. </p>
                <p>5.This activity will start at August 6th. LendChain will take a snapshot of all accounts at 11:00, and re-issue reward for all outstanding repayments which repayment time remains more than 7 days. For example, you have already invested 1 BTC before. After 10 days to expire, LendChain will issue 2800 LVCOIN directly to you. The raward will be issued in three days.</p>
                <p>6.The maximum number of the activity is 5 million LVCOIN. After the activity, it will enter other activities, and the rewards will be re-adjusted.</p>
                <p>7.LendChain has the final right to interpret the event as permitted by law and will strictly investigate false invitations.Once found,it will cancle the qualification.</p>
            </div>
        </div> 
    </div>
</template>
<script>
import QRCode from 'qrcodejs2';
export default {
       data() {
        return {
            redirect:this.$route.query.redirect,
            inviterurl: '', //我的推荐url
            invitercode:'', //我的推荐ID
            inviteramount:'', //邀请投资奖励金额
            inviternumber:'', //投资奖励金额
            authAmount: '' ,//邀请用户注册奖励金额
            myAuthAmount:'' //认证奖励
        }
    },
    created(){
        this.getkaohaiinviter()
    },
    mounted(){
        this.copyBtn1 = new this.clipboard(this.$refs.copy);
        this.copyBtn2 = new this.clipboard(this.$refs.copy2);
    },
    methods:{
        getkaohaiinviter(){ //获取靠海用户数据
            this.$axios.get('/trade/inviter/info/kaohai').then((res) => {
                switch (Number(res.code)) {
                    case 2000:
                        this.inviterurl=`https://mobile.lendx.vip/en/Register?code=${res.data.code}&source=0`; //线上
                        this.invitercode=res.data.code;
                        this.inviteramount=res.data.inviterInvestAmount;
                        this.inviternumber=res.data.investAmount;
                        this.authAmount=res.data.authAmount;
                        this.myAuthAmount=res.data.myAuthAmount;
                        this.qrcode(`https://mobile.lendx.vip/en/Register?code=${res.data.code}&source=0`); //线上
                    break;
                    default:this.$toast(res.message.toString());break;
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        copyTxt(query){ //复制链接
            let _this = this;
            let clipboard =query==1? _this.copyBtn1:_this.copyBtn2;
            clipboard.on('success', (e) =>{
              this.$toast('successful copy')
            });
            clipboard.on('error', function(e) {
                 this.$toast('Copying is not supported on your device, please copy it manually')
            });  
        },
        qrcode(url) { //生成二维码
            let that = this;
            let qrcode = new QRCode('qrcode', {
                width: 60, //宽度
                height: 60, // 高度  
                text: url // 二维码内容  
            });
        },
        cancelalert(e) { //点击顶部返回
            if(this.redirect){
                this.$router.push({path:this.redirect});
            }else{
                this.$router.push({path:'Personnal'});
            }
        }
    }
}
</script>
<style scoped>
@import "./recommendact.css";
</style>

