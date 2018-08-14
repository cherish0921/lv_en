<template>
    <div id="gift">
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../static/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                <p>Invite & Rewards</p>
            </div> 
        </div>
        <img id="headbanner" src="../../../static/images/personnal/module7/headbanner.png" alt="">        
        <div class="recommandsquire myrecommand">
            <div class="squireimg">
               My Suggestions
            </div>
            <div class="pipes clearfloat">
                <div class=" haf_pipes">
                    <p>Recommended code:</p>
                    <div>
                        <input type="text" readonly :value="invitercode" id="invitationid">
                         <span  ref="copy" data-clipboard-action="copy"  data-clipboard-target="#invitationid" @touchend="copyTxt(1)">Copy</span>
                    </div>
                </div>
                <div class=" haf_pipes">
                    <p>QRCode:</p>
                    <div id="qrcode"> </div>
                </div>
            </div>
            <div class="investlink">
                <p>Recommended link:</p>
                <div><input type="text" readonly :value="inviterurl" id="invitationlink">
                <span  ref="copy2" data-clipboard-action="copy"  data-clipboard-target="#invitationlink" @touchend="copyTxt(2)">Copy</span>
                </div>
            </div>
        </div> 
        <div class="recommandsquire myrecommandlist">
            <div class="squireimg">
            record
            </div>
            <div class="pipes">
                <div class=" haf_pipes">
                    <span>Recommended friends</span> 
                    <i>{{inviternumber}}个</i>
                </div>
                <div class=" haf_pipes">
                    <span> Commission Estimates Received</span> 
                    <i>{{inviteramount}}LV</i>
                </div>
            </div>
        </div> 
        <div class="recommandsquire myrecommandrule">
            <div class="squireimg">
                Activity Details
            </div>
            <div class="rules">
                <p>1.After the new user registers, the user should receive 50LV rewards.</p>
                <p>2.New users has to complete all certifications and then will receive 50LV awards.</p>
                <p>3.Each time you invite one user to register, you can get 25LV rewards, the maximum limit is 250LV.</p>
                <p>4.When the user you invited completes all certifications you will be rewarded with 25LV. The bonus limit is 500LV.</p>
                <p>5.When the user you invited completes the first investment, you can get 150LV rewards, the upper limit of 30000LV.</p>
                <p>6.When the user you invited completes the first loan, you can get 250LV reward, the reward limit is 25000LV.</p>
                <p>7.The maximum amount of the first phase of the event is 5 million LV. After the completion of the event, the second phase of the event will enter the second phase of the event. The invitation will be re-adjusted.</p>
                <p>8. LendChain shall have the final power of interpretation of the activity within the scope permitted by law, and will conduct rigorous investigations of false invitations. Once found, it will disqualify the award.</p>
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
            act: "",
            hassend: false,
            alertmodule: 0,
            inviterurl: '',
            invitercode:'',
            inviteramount:'',
            inviternumber:'',
            access_token:this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        }
    },
    mounted(){
         this.$axios.get("/trade/inviter/info").then( result1 => {
                          switch (Number(result1.code)) {
                              case 2000: 
                                this.inviterurl="https://mobile.lendx.vip/en/?code="+result1.data.code;
                                this.invitercode=result1.data.code;
                                this.inviteramount=result1.data.amount;
                                this.inviternumber=result1.data.number;
                                this.qrcode('https://mobile.lendx.vip/en/?code='+this.invitercode);
                              break;
                              default:
                              this.$toast(result1.message.toString())
                              break
                          }
         }) 
           this.copyBtn1 = new this.clipboard(this.$refs.copy);
           this.copyBtn2 = new this.clipboard(this.$refs.copy2);
    },
    methods:{
        copyTxt(query){
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
        cancelalert(e) {
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
#gift .header_pl{position: fixed;width: 100%;top: 0;z-index: 1000;
  color:#262626; background-color:#fff;margin-bottom:10px;text-align: center;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;background-color:#fff;    border-bottom: 1px solid #e6e6e6;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;float:left;}
#gift{
    position: absolute;
    width:100%;
    left:0;
    top: 0;
    padding-top: 1.2rem;
    min-height: 700px;
    background-color:#fff;
    z-index:90;
    background: url('https://s.lendx.vip/images/personnal/module7/bg_gift.png') no-repeat;
    background-size:cover;
    text-align:left;
}
#headbanner{width:100%;}
.recommandsquire{width: 90%;margin:1rem 5% 1rem;background-color:#fff;border-radius: 20px;font-size:14px;line-height: 30px;}
.recommandsquire .squireimg{position: absolute;width: 90%; margin-top: -10px;line-height:1rem;text-align:center;height:1.17rem;color:#fff;background: url('../../../static/images/personnal/module7/squire0.png') no-repeat;background-size: 4.5rem 1.17rem;background-position: center 0;}
.pipes,.investlink{width:100%;padding:0 .4rem;line-height: initial;padding-top:20px;}
.myrecommand .pipes{padding-top: 1.85rem;}
.investlink{padding:.7rem .4rem;}
.pipes p,.investlink p{color:#999;margin-bottom:10px;}
.pipes .haf_pipes{display:inline-block;width:49%;text-align:center;color:#262626;}
.haf_pipes input{width:90px;border:1px solid #509fff; height: 30px;line-height: 30px;text-align: center;}
.haf_pipes span,.investlink  span{ display: inline-block;padding-left:12px;border: 1px solid #509fff;font-size:16px; height: 30px;line-height: 30px;}
.myrecommand .haf_pipes span,.myrecommand .investlink>div span{float:right;padding: 0 6px;}
.pipes .haf_pipes:nth-child(2){float: right;}
.myrecommand .haf_pipes:nth-child(2){padding-left: 1rem;}
.investlink input{width:80%;border: 1px solid #509fff; height: 30px;line-height: 30px;}
.myrecommandlist{padding-bottom:.4rem ;}
.myrecommandlist .squireimg{background-image: url('../../../static/images/personnal/module7/squire1.png');text-align: center;}
.myrecommandlist .pipes{padding:1.17rem 0 0 0;font-size:14px;}
.myrecommandlist .haf_pipes span{border:0;line-height:inherit;color:#595959;text-align:center;background: url('../../../static/images/personnal/module7/squire1_frendicon.png') no-repeat center;background-size:contain;}
.myrecommandlist .haf_pipes span i{color:#FF7956}
.myrecommandlist .haf_pipes:nth-child(2) span{background-image: url('../../../static/images/personnal/module7/squire1_goldicon.png')}
.myrecommandrule .rules{padding:1rem .4rem ;font-size: 12px;color:#595959;}
.myrecommandrule p{line-height: initial;}
@media (max-width:321px){
    .pipes{line-height: 20px;}
    .haf_pipes input{width:70px;}
    .myrecommandlist .haf_pipes span{font-size: 12px;line-height: 30px;}
}
</style>

