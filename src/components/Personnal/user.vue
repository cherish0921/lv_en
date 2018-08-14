<template>
    <div id="user">
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../static/images/icon/pic_nav.png" @touchend="cancelalert" alt="返回"> 
                <p>个人中心</p>
            </div>  
            <img src="https://s.lendx.vip/images/personnal/module6/userphoto.png" alt="" srcset="">
            <p>{{email}}</p>
        </div>
        <div class="gobind" v-if="blockchain == 0">
            <p class="bindtip">温馨提示：选择不绑定后将永久失去绑定机会</p>
            <div class="confirmbtn" @touchend="changebindtype(1)">绑定LendChain账号</div>
            <div class="nocountbtn" @touchend="changebindtype(0)">我没有LendChain账号</div>
        </div>
        <div class="common" v-if="blockchain != 1">
            <div class="clearfloat" v-if="phone"><span>手机号</span><span>{{phone}}</span></div>
            <div class="clearfloat" v-if="!phone"><span>手机号</span><span @touchend="goToSet(1)">去设置</span><img src="../../../static/images/icon/arrow.png" alt="" srcset=""></div>
            <div class="clearfloat" v-if="nickname"><span>昵称</span><span>{{nickname}}</span></div>
            <div class="clearfloat" v-if="!nickname"><span>昵称</span><span @touchend="goToSet(2)">去设置</span><img src="../../../static/images/icon/arrow.png" alt="" srcset=""></div>
        </div>
          <GphoneVerify v-if="goToSetState" :verifyType="1" @hideVerify="hidegoToSetState()"></GphoneVerify>
        <bindasset v-if="bind_type!=-1" :type='bind_type'  @cancelputty="changebindtype(-1,$event)"></bindasset>
    </div>
</template>
<script>
import { mapState,mapGetters} from 'vuex'
import bindasset from '../common/bindasset'
import GphoneVerify from '@/components/Personnal/Safe/GphoneVerify'

export default {
    data() {
        return {
            act: "",
            blockchain: this.$store.state.blockchain,
            bind_type: -1, //0需生成新账户 1是绑定旧账户
            goToSetState: 0, //0代表去谷歌验证 1代表去设置手机号 2代表去设置昵称
            phone: this.LEND.localStorage('phone') || this.$store.state.phone || '',
            nickname: this.LEND.localStorage('nickname') || this.$store.state.nickname || '',
            email: this.LEND.localStorage('email') || this.$store.state.email || '',
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        };
    },
    props: ["action"],
    updated() {
        this.$data.blockchain = this.$store.state.blockchain;
    },
    components: {
        bindasset,
        GphoneVerify
    },
    methods: {
        cancelalert() {
            this.$router.go(-1);
        },
        changebindtype(val) {
            this.bind_type = val
            if (bol) { //存在说明已经成功绑定账号并关闭当前弹窗
                this.$emit('getUserInfo', bol);
            }
            this.$emit('cancelalert');
        },
        goToSet(val) {
            this.goToSetState = val;
        },
        hidegoToSetState(){
             this.goToSetState = 0;
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
                            this.$toast('设置成功');
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
#user{position:absolute;z-index:90;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;}.header_pl{padding-bottom:.4rem;color:#fff; background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));text-align:center;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
.header_pl>img{height:2.1rem;margin:0 auto;}
#user .bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;}
#user .common{margin-top:10px;text-align: right;}
#user .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:1px solid #e5e5e5;padding-right:.4rem;}
#user .common span:first-child{float: left;margin-left:.4rem;}
#user .common img{height:.37rem;vertical-align: text-bottom;transform: rotate(-90deg);}  
#user .confirmbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
#user .nocountbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;border:1px solid #509fff;color:#509fff;}
</style>
