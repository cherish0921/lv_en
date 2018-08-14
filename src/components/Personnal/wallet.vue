<template>
    <div id="wallet">
        <div class="personnal">
            <coinoperation v-if="opercoincode" :maxAmount="maxAmount" :aid="aid" :depositaddr="depositaddr" :fees="fees" @cancelputty="cancelputty" :operName="operName" :opercoincode="opercoincode" :min="min" :sure="sure" :can="can" ></coinoperation>
            <div class="header_pl" style="text-align:center;">
                <div class="headerline">
                    <img src="../../../static/images/icon/pic_nav.png" @touchend.stop="cancelalert"  alt=""> 
                    <p>我的钱包</p>
                </div>    
                <div class="haslogin">
                    <div class="moneytitle clearfloat">   
                        <span>可用余额(CNY)</span>  
                    </div>
                    <div class="moneyval">≈<span>{{lastAmount?lastAmount:0}}</span></div>
                </div>
                <div class="coinlist">
                    <div class="cointype" v-for="(item,index) in coinlist" :key=index>
                        <div class="tl_cointype">
                            <span>币种</span>
                            <span>数量</span>
                            <span>操作</span>
                        </div>
                        <div class="ct_cointype">
                            <span>{{item.cryptoCode}}</span>
                            <span>{{item.amount}}</span>
                            <div>
                                <span  @touchend="gocoinoperation(item.cryptoCode,'deposit',item.amount)" class="">充值</span>
                                <!-- <span v-if="item.depositStatus"  class="dark">充值</span> -->
                                <span @touchend="gocoinoperation(item.cryptoCode,'withdraw',item.amount)" class="">提现</span>
                                <!-- <span v-if="item.withdrawStatus" class="dark">提现</span> -->
                                <span @touchend="gocoinoperation(item.cryptoCode,'transfer',item.amount)" class="">转账</span>
                                <!-- <span v-if="item.transferStatus" class="dark">转账</span> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="noMoreData" style="text-align:center;">no more data</div>
        </div>
    </div>
</template>
<style lang="sass" scoped>
@import '../../assets/css/MyCenter.scss'
</style>
<script>
import coinoperation from './coinoperation'

export default {
    data() {
        return {
            coinlist:[],  //币种的列表
            noMoreData:false, //显示暂无更多数据
            operName:'withdraw', //默认是提现  deposit表示充值  transfer表示转账
            opercoincode:'',   //对应的是币种 "BTC" "ETH"  "USDT"
            depositaddr:[],  //对应的是充值序列号
            min:0,   //最少充值数额
            sure:0,  //可网络确认次数  
            can:1,   //可提币次数
            fees:0,  //提现手续费
            aid:-1,   //每项币种的id值
            lastAmount: this.$route.query.lastAmount,
            maxAmount:'', //保存最大可提现的数量
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        };
    },
    created() {
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
    components:{
        'coinoperation':coinoperation
    },
    methods: {
        cancelputty(num){
            if(num){
                this.$emit('cancelalert',7);
            }
            this.$data.opercoincode='';
        },
        gocoinoperation(cryptoCode,isadd,amount){
            this.maxAmount = amount; //保存最大可提现的数量
            let operitem = {}
            this.$data.operName = isadd;
            this.$data.opercoincode = cryptoCode
            var mapasset = this.$data.coinlist.filter(function(x, index) {
                                return x.cryptoCode === cryptoCode
                            })[0]
            this.$data.depositaddr = mapasset.depositAddrs;
            this.$data.aid = mapasset.cryptoId;
            switch(cryptoCode){
                case 'USDT':
                operitem.minr=100
                operitem.minw=200
                this.$data.min=100
                this.$data.sure=1
                this.$data.can=6
                this.$data.fees=10
                break;
                case 'GXS':
                operitem.minr=10
                operitem.minw=10
                this.$data.min=10
                this.$data.sure=0
                this.$data.can=0
                this.$data.fees=0.3
                break;
                case 'ETH':
                operitem.minr=0.01;
                operitem.minw=0.015;
                this.$data.min=0.01
                this.$data.sure=15
                this.$data.can=30
                this.$data.fees=0.008
                break;
                case 'BTC':
                operitem.minr=0.001;
                operitem.minw=0.01;
                this.$data.min=0.001
                this.$data.sure=1
                this.$data.can=6
                this.$data.fees=0.0005
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
                this.$data.min=0
                this.$data.sure=0
                this.$data.can=0
                this.$data.fees=0
                break;
            }
        },
        cancelalert(){
            this.$router.push({name:'Personnal'});
        }
    }
}
</script>
<style scoped>
#wallet{position:absolute;z-index:90;min-height:100%;;width:100%;background-color:#f5f5f5;overflow:hidden;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;float:left;padding: 0.4rem;z-index: 10;}
.coinlist .cointype{width:100%;padding:.5rem .4rem;background-color:#fff;} 
.coinlist .cointype .tl_cointype, .coinlist .cointype .ct_cointype{text-align: left;}
.coinlist .cointype .tl_cointype{font-size:12px;color:#999;}
.coinlist .cointype .ct_cointype{font-size:16px;}
.coinlist .cointype .tl_cointype>span, .coinlist .cointype .ct_cointype>span,.coinlist .cointype .ct_cointype>div {display:inline-block;}
.coinlist .cointype .tl_cointype>span:first-child,.coinlist .cointype .ct_cointype>span:first-child{width:1.2rem}
.coinlist .cointype .tl_cointype>span:nth-child(2),.coinlist .cointype .ct_cointype>span:nth-child(2){width:3.87rem;text-align:left;}
.coinlist .cointype .ct_cointype>div>span{display:inline-block;width:1.1rem;font-size:14px;color:#509fff;cursor:pointer;}
.coinlist .cointype .ct_cointype>div>.dark{color:#e6e6e6;cursor:none;}
/*.coinlist .cointype .tl_cointype span:last-child{float:right;padding-right:.7rem;}*/
</style>
