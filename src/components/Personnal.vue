<template>
    <div class="personnal">
        <div class="header_pl">
            <div class="nologin" v-if="!haslogin">
                <img src="../../static/images/icon/logo@2x.png" alt=""> 
                <router-link to="/Login"><span>Login/Sign Up</span></router-link>
            </div>    
            <div class="haslogin" v-if="haslogin">
                <div class="userheader clearfloat">
                    <img src="../../static/images/icon/logo@2x.png" alt="">{{nickname?nickname:email}}
                    <img src="../../static/images/personnal/messages.png" alt="" srcset="">
                </div>
                <div class="moneytitle clearfloat" style="min-height:1rem;">   
                    <span>Total funds estimation(USDT)</span>
                    <img v-show="showTotalAmount" @touchend="toggleAmount()" src="../../static/images/personnal/seeassets1.png" alt="show">
                    <img v-show="!showTotalAmount" @touchend="toggleAmount()" src="../../static/images/personnal/seeassets0.png" alt="hide">
                </div>
                <div class="moneyval"><span v-show="showTotalAmount">≈</span><span>{{!showTotalAmount?showStar:totalAmount?totalAmount:0}}</span></div>
                <div class="moneyother clearfloat">
                    <p><span>Yesterday's earnings(USDT)</span><span v-show="showTotalAmount">≈</span><span>{{!showTotalAmount?showStar:userInfoData.profit?userInfoData.profit:0}}</span></p>
                    <p @touchend="toWallet()"><span>Balance(USDT)</span><span v-show="showTotalAmount">≈</span><span>{{!showTotalAmount?showStar:userInfoData.lastAmount?userInfoData.lastAmount:0}}</span><span><img src="../../static/images/icon/pic_nav.png" alt="" srcset=""></span></p>
                </div>
            </div>
        </div>
        <div class="main_pl">
            <div class="asset-manager bigmodule">
                <p>Asset Management</p>
                <div class="asset-managerbox">
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Wallet'"><img src="../../static/images/personnal/wallet.png" alt="My Wallet">My Wallet</router-link></div>
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Myinvestment'"><img src="../../static/images/personnal/investment.png" alt="My Assets">My Assets</router-link></div>
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link :to="!hasloginls?'/Login':'/Logs'"><img src="../../static/images/personnal/logs.png" alt="Transaction History">Transaction History</router-link></div>
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link :to="!hasloginls?'/Login':'/Myborrows'"><img src="../../static/images/personnal/borrow.png" alt="Borrowing History">Borrowing History</router-link></div>
                </div>
            </div>
            <div class="account-manager bigmodule">
                <p>Account management </p>
                <div class="asset-managerbox">
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/UserCenterSetting'"><img src="../../static/images/personnal/user.png" alt="My Account">My Account</router-link></div>
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Safe'"><img src="../../static/images/personnal/safe.png" alt="Security Certer">Security Center</router-link></div>
                    <div class="asset-managerboxitem"><router-link to="/About"><img src="../../static/images/personnal/about.png" alt="">About Us</router-link></div>
                    <!-- <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Gift'"><img src="../../static/images/personnal/gift.png" alt="">Invite & Rewards</router-link></div> -->
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/recommendact'"><img src="../../static/images/personnal/gift.png" alt="">Invite & Rewards</router-link></div>
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link to="/Help"><img src="../../static/images/personnal/help.png" alt="">Help Center</router-link></div>
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link to="/Setting"><img src="../../static/images/personnal/setting.png" alt="Set Up">Settings</router-link></div>
                </div>
            </div>
        </div>
  </div>
</template>
 
<script>
import { mapState,mapActions } from 'vuex'

export default {
    name: 'index',
    data() {
        return {
            nickname: this.LEND.localStorage('nickname') || '',
            email: this.LEND.localStorage('email') || '',
            usercenterAction: 'login', //选择center模块的具体模块 登录 注册 忘记密码等
            userInfoData: '',
            totalAmount: '', //用于传给钱包组件
            showTotalAmount: true,
            showStar:'****',
            hasloginls:this.LEND.localStorage('haslogin')||false,
            access_token:this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
        }
    },
    computed: {
        ...mapState(['haslogin','blockchain'])
    },
    created() {
        if(this.access_token){
            this.getUserInfo();  //去获取个人信息 
            // this.$axios.get(`${this.Posturl}/price/latest?symbol=1099`).then(res => {
            //     this.utoc=res.data.price
            // })  
        }
    },
    methods: {
        ...mapActions([
            'changeState'
        ]),
        toggleAmount(){
            this.showTotalAmount = !this.showTotalAmount;
        },
        getUserInfo() { //获得个人信息
            
            // this.changeState({type:'isloading',value:true})
            this.$axios.get(`/trade/user/profile`).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.LEND.localStorage('nickname', res.data.nickname);
                            this.LEND.localStorage('email', res.data.email);
                            let phone = res.data.phone == 'null'?'':res.data.phone;
                            this.LEND.localStorage('phone',phone);
                            this.nickname = res.data.nickname?res.data.nickname:res.data.email;
                            this.changeState({
                                type: 'haslogin',
                                value: true
                            });
                            this.userInfoData = res.data;
                            // this.userInfoData.lastAmount=(this.userInfoData.lastAmount).toFixed(2)
                            // this.userInfoData.profit=(this.userInfoData.profit).toFixed(2)
                            // this.userInfoData.totalAmount=(this.userInfoData.totalAmount).toFixed(2)
                             this.totalAmount = this.userInfoData.totalAmount?(this.userInfoData.totalAmount).toFixed(2):'';
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
                this.changeState({type:'isloading',value:false})
                // this.changeState({type:'isloading',value:false})
            });
        },
        toWallet() {
            this.$router.push({path:'/Wallet'});
        },
        toSetting(){
            if(!this.haslogin){
                this.$router.push({path:'/Login'});
            }else{
                this.$router.push({path:'/Setting'});
            }
        }
    }
}
</script>
<style lang="sass" scoped>
@import '../assets/css/MyCenter.scss'
 
</style>
<style>
.personnal{background-color: #f5f5f5;}
.account-manager{margin-bottom:3rem;}
.main_pl{background-color: #f5f5f5;}
.main_pl .bigmodule>p{text-align: left;padding-left: .4rem;line-height: 1.07rem;font-size: 14px;background-color: #fff;border-bottom: 1px solid #e6e6e6;color: #999;}
</style>

<!-- <style lang="sass">

@import "@/css/MyCenter.scss"

</style> -->