<template>
    <div id="user">
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../../static/images/icon/pic_nav.png" @touchend="goBack" alt="back"> 
                <p>My Account</p>
            </div>  
            <img src="https://s.lendx.vip/images/personnal/module6/userphoto.png" alt="userphoto">
            <p>{{email}}</p>
        </div>
        <router-view/>
    </div>
</template>
<script>
import { mapState,mapGetters} from 'vuex'

export default {
    data() {
        return {
            email: this.LEND.localStorage('email')
        }
    },
    updated() {
    },
    components: {
    },
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped>
#user{position:absolute;z-index:90;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;}.header_pl{padding-bottom:.4rem;color:#fff; background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));text-align:center;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;font-size:16px;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
.header_pl>img{height:2.1rem;margin:0 auto;}
.header_pl>p{font-size:16px;}
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
