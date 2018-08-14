<template>
<div id="setting">
    <div class="header_pl">
        <div class="headerline">
            <img src="../../../static/images/icon/pic_navb.png" @touchend="goBack" alt=""> 
            <p>Settings</p>
        </div> 
    </div>
    <div  v-if="hasloginls" class="common">
        <div class="clearfloat" @touchend="toModifyPass">
            <span>Reset Password</span><img src="../../../static/images/icon/arrow.png" alt="Reset">
        </div>
    </div>
   <div  class="common">
     <div class="clearfloat" @touchend="toModifyLang">
            <span>Language</span><img src="../../../static/images/icon/arrow.png" alt="Language">
        </div> 
    </div>
    <div v-if="hasloginls" class="quitapp" @touchend="quitapp">Logout</div> 
</div>
</template>
<script>
import { mapState,mapGetters,mapActions } from 'vuex'

export default {
    data() {
        return {
            showStatus: false, //默认隐藏
            phone: this.LEND.localStorage('phone') || this.$store.state.phone || '',
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
            hasloginls:this.LEND.localStorage('haslogin')||false,
        };
    },
    props: ["action"],
    mounted() {
    },
    methods: {
        ...mapActions(['changeState']),
        // toggleputty(bol){
        //     this.showStatus = false;
        //     if(bol){
        //         this.cancelalert();
        //     }
        // },
        toModifyPass(){
            this.$router.push({path:'/ModifyPass'});
        },
        toModifyLang(){
             this.$router.push({path:'/Language'});
        },
        goBack() {
           this.$router.push({path:'/Personnal'});
        },
        // toModifyPass() {
        //     this.showStatus = true;
        // },
        quitapp() { //退出登录
            this.$axios.get(`/trade/logout`).then(res => {
                if (Number(res.code) !== 2000) {
                    this.$toast('net error');         
                } else {
                    this.$toast('loginout success');
                    this.changeState({type:'blockchain',value:-1});
                    this.changeState({type:'haslogin',value:false});
                    this.LEND.removeLocalStorage('access_token');
                    this.LEND.removeLocalStorage('haslogin');
                    this.LEND.removeLocalStorage('iphone');
                    this.LEND.removeLocalStorage('igoogle');
                    this.LEND.removeLocalStorage('nickname');
                    this.LEND.removeLocalStorage('phone');
                    this.$router.push({path:'/'});
                }
            });
            this.$emit('cancelalert');
        }
    }
}
</script>
<style scoped>
#setting{position:absolute;z-index:90;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;text-align:center;}
#setting .header_pl{color:#262626;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
#setting .header_pl>img{height:2.1rem;margin:0 auto;}
#setting .bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;}
#setting .common{margin-top:10px;text-align: right;}
#setting .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:1px solid #e5e5e5;padding-right:.4rem;}
#setting .common span:first-child{float: left;margin-left:.4rem;font-size:16px;}
#setting .common img{height:.37rem;vertical-align: text-bottom;transform: rotate(-90deg);}  
#setting .confirmbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
#setting .nocountbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;border:1px solid #509fff;color:#509fff;}

.quitapp{  width: 100%;height:1.33rem;  margin-top: 10px;line-height: 1.33rem;color:#509fff;text-align: center;background-color: #fff;font-size: 16px;}
</style>
