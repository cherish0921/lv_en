<template>
    <div id="wallet">
        <div class="personnal">
           <!--  <coinoperation v-if="opercoincode" :maxAmount="maxAmount" :aid="aid" :depositaddr="depositaddr" :fees="fees" @cancelputty="cancelputty" :operName="operName" :opercoincode="opercoincode" :min="min" :sure="sure" :can="can" ></coinoperation> -->
            <div class="header_pl" style="text-align:center;">
                <div class="headerline">
                    <img src="../../../../static/images/icon/pic_nav.png" @touchend.stop="cancelalert"  alt=""> 
                    <p>My Assets</p>
                </div>    
                <div class="haslogin">
                    <div class="moneytitle clearfloat">   
                        <span>Balance(USDT)</span>  
                    </div>
                    <div class="moneyval">≈<span>{{lastAmount}}</span></div>
                </div>
                <div class="coinlist">
                    <div class="cointype" v-for="(item,index) in coinlist" :key=index>
                        <div class="tl_cointype" style="line-height:60px;height:60px;border-bottom:1px solid #e6e6e6;">
                           <div class="lf_tl_cointype" style="font-size:16px;color:#262626;">
                               <img :src="'https://s.lendx.vip/static/en/images/personnal/module2/'+item.cryptoCode+'icon.png'" alt="" srcset="" style="width:22px;vertical-align: middle;">
                               {{item.cryptoCode}}
                                <span>{{coinshowrule(item.amount,item.cryptoCode)}}</span>
                               </div>
                        </div>
                        <div class="ct_cointype">
                                <span v-if="item.depositStatus" @touchend="toNextPage(item.cryptoCode,'/Deposit',item.amount)">Deposit</span>
                                <span v-if="!item.depositStatus"  class="dark">Deposit</span>
                                <span v-if="item.withdrawStatus" @touchend="toNextPage(item.cryptoCode,'/Withdraw',item.amount)">Withdrawal</span>
                                <span v-if="!item.withdrawStatus" class="dark">Withdrawal</span>
                                <span v-if="item.transferStatus" @touchend="toNextPage(item.cryptoCode,'/Transfer',item.amount)">Transfer</span>
                                <span v-if="!item.transferStatus" class="dark">Transfer</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="noMoreData" style="text-align:center;">No data at the moment</div>
        </div>
    </div>
</template>
<style lang="sass" scoped>
@import '../../../assets/css/MyCenter.scss'
</style>
<script>
// import coinoperation from './coinoperation'

export default {
    data() {
        return {
            coinlist:[],  //币种的列表
            toNextData:{},//用于传递到下个路由的数据集, 
            noMoreData:false, //显示暂无更多数据
            lastAmount: '',
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        };
    },
    created() {
        this.getUserInfo();
        //获取钱包列表
        this.$axios.get('/trade/asset/index',{params: {page:1,page_size:10}}).then( result => {
            switch (Number(result.code)) {
                case 2000:
                {
                    this.coinlist = result.data;
                    if(!this.coinlist.length){
                        this.noMoreData = true;
                    }
                    break;
                }
                    default:
                {
                }
            }
        });
    },
    methods: {
        getUserInfo() { //获得个人信息
            this.$axios.get(`/trade/user/profile`).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.lastAmount = res.data.lastAmount;
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
            });
        },
        coinshowrule(mount,coinid){
            let remount=mount
            let decimalpoint=mount.toString().lastIndexOf('.')//小数点位置
            if(decimalpoint!=-1){
                let decimal= mount.toString().slice(decimalpoint,mount.toString().length)//小数点后数值
                let decimalnum= mount.toString().length-decimalpoint//小数点后位数
                if(Number(mount)<1000000000){
                    //console.log(mount,'小于1个亿'+mount.toString().slice(0,decimalpoint),decimal.slice(10-decimalpoint))
                    if(coinid=="LV"||(coinid=="GXS")){
                        remount=mount.toString().slice(0,decimalpoint)+decimal.slice(0,6)
                    }else{
                        remount=mount.toString().slice(0,decimalpoint)+decimal.slice(0,11-decimalpoint)
                    }
                }
            }
            return remount.toString();
        },
        toNextPage(cryptoCode,type,amount){
            let operitem = {}
            operitem.maxAmount = amount; //保存最大可提现的数量
            operitem.opercoincode = cryptoCode  //对应的是币种 "BTC" "ETH"  "USDT"
            var mapasset = this.$data.coinlist.filter(function(x, index) {
                                return x.cryptoCode === cryptoCode
                            })[0]
            operitem.addr = mapasset.depositAddrs.addr;  //对应的是充值序列号
            operitem.memo = mapasset.depositAddrs.memo;  //对应的是充值序列号
            operitem.aid = type=='/Withdraw'?mapasset.id:mapasset.cryptoId;   //每项币种的id值 提现ID跟转账ID不同
            switch(cryptoCode){
                case 'USDT':
                operitem.minr=100//最小充值数额
                operitem.minw=200//最小提现数额
                operitem.sure=1   //可网络确认次数  
                operitem.can=6    //可提币次数
                operitem.fees=10  //提现手续费
                break;
                case 'GXS':
                operitem.minr=10
                operitem.minw=10
                operitem.sure=0
                operitem.can=0
                operitem.fees=0.3
                break;
                case 'ETH':
                operitem.minr=0.01;
                operitem.minw=0.015;
                operitem.sure=15
                operitem.can=30
                operitem.fees=0.008
                break;
                case 'BTC':
                operitem.minr=0.001;
                operitem.minw=0.01;
                operitem.sure=1
                operitem.can=6
                operitem.fees=0.0005
                break;
                 case 'LV':
                operitem.minr=1;
                operitem.minw=100;
                operitem.sure=0
                operitem.can=0
                operitem.fees=5
                break;
                case 'QKC':
                operitem.minr=75;
                operitem.minw=75;
                this.$data.min=75
                this.$data.sure=15
                this.$data.can=30
                this.$data.fees=37.5
                break;
                default:
                operitem.minr=0;
                operitem.minw=0;
                operitem.sure=0
                operitem.can=0
                operitem.fees=0
                
                break;
            }
            this.toNextData = operitem ;
            this.$router.push({path:type,query:this.toNextData});
        },
        cancelalert(){
            if(this.$route.query.redirect){ //重定向跳转
                this.$router.push({path:this.$route.query.redirect});
            }else{
                this.$router.push({name:'Personnal'});
            }
        }
    }
}
</script>
<style scoped>
#wallet{position:absolute;z-index:90;min-height:100%;;width:100%;background-color:#f5f5f5;overflow:hidden;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;float:left;padding: 0.4rem;z-index: 10;}
.coinlist{background-color:#f5f5f5;}
.coinlist .cointype{width:100%;margin-bottom:10px;padding:0rem;background-color:#fff;} 
.coinlist .cointype:last-child{border-bottom:0;} 
.coinlist .cointype .tl_cointype, .coinlist .cointype .ct_cointype{text-align: left;padding:0 .4rem;}
.coinlist .cointype .tl_cointype{font-size:12px;color:#999;border-bottom:1px solid #e6e6e6;}
.coinlist .cointype .tl_cointype span:last-child{width:6rem;text-align:center;float: right;}
.coinlist .cointype .ct_cointype{font-size:16px;line-height:40px;height:40px;padding:0;}
.coinlist .cointype .ct_cointype span{display:inline-block;width:3.2rem;text-align:center;color:#509fff;}
.coinlist .cointype .ct_cointype span:nth-child(1),.coinlist .cointype .ct_cointype span:nth-child(2){border-right:1px solid #e6e6e6;}
.coinlist .cointype .ct_cointype .dark{color:#e6e6e6;}

/*.coinlist .cointype .tl_cointype span:last-child{float:right;padding-right:.7rem;}*/
</style>
