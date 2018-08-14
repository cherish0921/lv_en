<template>
<div class="common">
    <div class="clearfloat" v-if="String(phone).length>=6">
        <span>Phone Number</span><span>{{phone}}</span>
    </div>
    <div class="clearfloat" v-if="String(phone).length<6">
        <span>Phone Number</span><span @touchend="goToSet(1)" style="padding-right:5px;color:#595959;">Set Up</span><img src="../../../../static/images/icon/arrow2.png" alt="Set Up">
    </div>
    <div class="clearfloat" v-if="nickname">
        <span>Nickname</span><span>{{nickname}}</span>
    </div>
    <div class="clearfloat" v-if="!nickname">
        <span>Nickname</span><span @touchend="goToSet(2)" style="padding-right:5px;color:#595959;">Set Up</span><img src="../../../../static/images/icon/arrow2.png" alt="Set Up">
    </div>
    <div class="fixed-box" v-show="goToSetState">
        <verification :goToSetState="goToSetState" @hideVerification="hideVerification"></verification>
    </div>
</div>
</template>
<script>
import { mapState,mapGetters} from 'vuex'
import verification from '@/components/Personnal/Comm/verification'

export default {
    data() {
        return {
            goToSetState:'', 
            phone: this.LEND.localStorage('phone') || this.$store.state.phone || '',
            nickname: this.LEND.localStorage('nickname') || this.$store.state.nickname || '',
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        };
    },
    components:{
        verification
    },
    methods: {
        goToSet(val) {
            this.goToSetState = val
        },
        hideVerification(val, key) {
            if (key == 'phone') {
                this.goToSetState = 0;
                this.phone = val;
            } else if (key == 'nickName') {
                this.callBackFun(val);
            }else{
                this.goToSetState = 0;
            }
        },
        callBackFun(val){
            this.$axios.post('/trade/user/nickname', {
                nickname: val,
                access_token:this.access_token
            }).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {   
                            this.goToSetState = 0;
                            this.nickname = val;
                            this.LEND.localStorage('nickname',this.nickname);
                            this.$toast('Successfully set up');
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
</script>
<style scoped>
.fixed-box{
    position: fixed;
    top: 0;
    z-index: 10000;
    width: 100%;
}
.clearfloat span:first-child{
    color:#999;
}
.clearfloat span:nth-child(2){
    color: #262626;
    vertical-align: middle;
}
#user{position:absolute;z-index:90;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;}.header_pl{padding-bottom:.4rem;color:#fff; background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));text-align:center;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
.header_pl>img{height:2.1rem;margin:0 auto;}
#user .bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;}
#user .common{margin-top:10px;text-align: right;font-size:16px;}
#user .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:1px solid #e5e5e5;padding-right:.4rem;}
#user .common span:first-child{float: left;margin-left:.4rem;}
#user .common img{height:.37rem;vertical-align: text-bottom;}  
#user .confirmbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
#user .nocountbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;border:1px solid #509fff;color:#509fff;}
</style>
