<template>
<div id="safe">
    <!-- <bindasset v-if="alertmodule==2" type='3' :redirect="redirect" @cancelputty="changealertmodule(-1,$event)"></bindasset>
    <gauthponent v-show="alertmodule==1" type="r" :redirect="redirect" gtext="sdss" btntext="确认" title="谷歌认证" @cancelalert="changealertmodule(-1,$event)"/> -->
    <GphoneVerify v-if="verifyType>0&&verifyType>0<3" :verifyType="verifyType" @hideVerify="changeVerifyType('',$event)">{{title}}</GphoneVerify>
    <div class="header_pl">
        <div class="headerline">
            <img src="../../../../static/images/icon/pic_navb.png" @touchend="goBack" alt="返回"> 
            <p>Security Settings</p>
        </div>  
    </div>
    <div class="tl_myinvesttype">
        <div>
            <p>SMS Verification</p>
            <p>For withdrawal, password reset and security settings</p>
         </div>     
          <span class="rightbtn" :class="{active:!parseInt(activePhone)}" @touchend="changeVerifyType(1,$event)">{{parseInt(activePhone)?'Verified':'Verify'}}</span>  
    </div>
    <div class="tl_myinvesttype">
        <div>
            <p>Google Authentication</p>
            <p>For login, withdrawal, password retrieve,setting modification and API management</p>
        </div> 
         <span class="rightbtn" :class="{active:!parseInt(activeIgoogle)}" @touchend="changeVerifyType(2,$event)">{{parseInt(activeIgoogle)?'Verified':'Verify'}}</span>
    </div>
    <div class="tl_myinvesttype">
        <div>
            <p>Know Your Customer</p>
            <p>The user who completes the authentication can withdraw the coin.</p>
        </div> 
         <span class="rightbtn" v-if="(Number(activeKYC)==3)" :class="{'active':(Number(activeKYC)==3)}" @touchend="showReason()" style="right:2rem;">refuse reason</span> 
         <span class="rightbtn" :class="{'active':((Number(activeKYC)<1)||(Number(activeKYC)>2))}" @touchend="changeVerifyType(3,$event)">{{kyctext(activeKYC)}}</span>
    </div>   
</div>
</template>
<script>
import GphoneVerify from './GphoneVerify'
export default {
    data() {
        return {
            verifyType: '',  //验证类型 1代表是手机  2代表是谷歌
            alertmodule: 0,
            activePhone: this.LEND.localStorage('iphone'),
            activeIgoogle: this.LEND.localStorage('igoogle'),
            activeKYC:this.LEND.localStorage('kyc')||0,
            redirect:this.$route.query.redirect
        }
    },
    updated(){
        this.$axios.get(`/trade/user/profile`).then(res => {
            switch (Number(res.code)) {
                case 2000:
                    {
                        this.activeKYC=this.LEND.localStorage('kyc')||0
                        break;
                    }
                default:
                    {
                        this.$toast(res.message);
                    }
            }
        });
    },
    computed:{
        title(){  //用于传递子组件通过slot
            return this.verifyType==1?'SMS Verification':this.verifyType==2?'SMS Verification':'Google Authentication';
        },
    },
    methods: {
        changeVerifyType(val, event) {
            if (event) { //灰色按钮的话阻止点击
                let rightbtn = event.target;
                if (!this.LEND.hasClass(rightbtn, 'active')) {
                    return;
                }
            }
            if(val==3){
                this.$router.push({path:'/Kycinput'})
            }
            if (val == 2) {
                if (!parseInt(this.activePhone)) {
                    this.$toast('Please verify the phone');
                    return;
                }
            }
            this.verifyType = val;  //验证类型 1代表是手机 2代表是谷歌3代表KYC
            this.activePhone = this.LEND.localStorage('iphone');   
            this.activeIgoogle = this.LEND.localStorage('igoogle');
        },
                showReason(){
                    this.$axios.get('/trade/user/kyc/desc', {params: {'access_token':this.LEND.localStorage('access_token')}}).then( res=> {
                                let tips=res.data||''
                               this.$toast(tips+'')
                                    this.buyval=''
                                    this.incomeval=''
                    })
                },
                kyctext(key){
            switch(Number(key)){
                case 0:
                return 'Verify'
                break
                case 1:
                return 'Waiting'
                break
                case 2:
                return 'Verified'
                break
                case 3:
                return 'Refuse'
                break
                default:
                break;
            }
        },
        goBack() {
            if (this.redirect) {
                this.$router.replace({path: this.redirect});
            } else {
                this.$router.go(-1);
            }
        }
    },
    components: {
        GphoneVerify
        // 'bindasset': bindasset
    }
}
</script>
<style scoped>
#safe{position:absolute;z-index:90;min-height:100%;width:100%;background-color:#f5f5f5;overflow-x:hidden;text-align: center;}
.personnal .header_pl{color:#262626; background-color:#fff;margin-bottom:10px;}
.headerline{height:1.17rem;line-height:1.17rem;border-bottom:.5px solid #e6e6e6;font-size:16px;background-color:#fff;margin-bottom:10px;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
.personnal .header_pl>img{height:2.1rem;margin:0 auto;}
#safe  .tl_myinvesttype{display:flex;align-items: center;font-size:16px;color:#262626;text-align:left;padding:.4rem;background-color:#fff;border-bottom:.5px solid #e6e6e6;}
#safe  .tl_myinvesttype>div{flex: 1;}
#safe  .tl_myinvesttype>div p:nth-child(2){margin-top:10px;font-size: 12px;color: #999;}
#safe  .tl_myinvesttype>span{color: #999;margin-left:10px;}
#safe .tl_myinvesttype>span.active {color: #509fff;}
#safe .confirmbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
#safe .nocountbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;border:1px solid #509fff;color:#509fff;}
</style>
