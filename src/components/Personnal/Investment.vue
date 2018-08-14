<template>
<div id="_investment">
    <div class="header_pl">
        <div class="headerline">
            <img src="../../../static/images/icon/pic_navb.png" alt="" @touchend="cancelalert"> 
             <p>Loan History</p>
        </div>    
        <div class="myinvestlist" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <transition-group name="lendchainfade1">
            <div class="myinvesttype" v-for="(item,index) in investList" :key="index">
                <div class="tl_myinvesttype">
                    <div >
                        <p>{{item.orderId}}</p>
                        <p>{{item.ctime}}</p>
                    </div>
                    <p class="investstatus" :class="computedClass(item.status)" >{{getInverstmentStatus(item.status)}}</p>
                </div>
                <div class="ct_myinvesttype">
                    <p><span>Loan Amount</span><span>{{item.amount}}&nbsp;{{item.cryptoCode}}</span></p>
                    <p><span>Interest</span><span>{{parseFloat(item.profit.toFixed(6))}}&nbsp;{{item.cryptoCode}} </span></p>
                    <p><span>Expiration time</span><span>{{item.deadline}}</span></p>
                    <p><span>Repayment time</span><span>{{item.cutoffTime}}</span></p>
                </div>
            </div>

            </transition-group> 
            <div class="more_loading" v-show="loading" style="padding: 8px 0;">
                <mt-spinner type="fading-circle" color="#509fff" :size="20" v-show="loading&&!isLastPage&&page!=1"></mt-spinner>
                <span v-show="isLastPage" style="color:#999;">No more data</span>
            </div>
        </div>
        <!-- <div v-if="noMoreData">no nore data</div> -->
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            page:1,
            page_size:10,
            isLastPage:false, //是否是最后一页,默认为false
            loading:false, //默认开始允许下拉
            investList:[],
            // noMoreData:false, //显示暂无更多数据
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        }
    },
    mounted() {
    },
    methods: {
        loadMore() { //页面刚加载默认会加载一次
            this.loading = true;
            this.changenow_log(this.page,this.page_size);
        },
        changenow_log(page,page_size){
            if(this.isLastPage){
                setTimeout(()=>{
                    this.loading = false;    
                },500);
                return; 
            } 
            let formatData = {
                page: page || 1,
                page_size: page_size || 10    
            };
            this.$axios.get('/trade/user/invests',{params: formatData}).then( res => {
                if(Number(res.code)==2000) {
                    let list = res.data;
                    list.forEach((item) => {
                        item.ctime=this.LEND.timeToLocal(item.ctime);//出借时间
                        item.cutoffTime=Number(item.cutoffTime)?this.LEND.timeToLocal(item.cutoffTime):'';//还款时间
                        item.deadline = Number(item.deadline)?this.LEND.timeToLocal(item.deadline):'';//到期时间    
                    });
                    this.investList = this.investList.concat(list);
                    this.loading = false;
                    if(res.data.length<this.page_size){ //返回的条数小于默认的条数
                        this.isLastPage = true;   //已经是最后一页 
                    }else{
                        this.page++; 
                    }
                }else{
                }
            });
        },
        computedClass:function(status){
            if(Number(status)==0){
                return'active';
            }else if(Number(status)>10){
                return 'darkcolor';
            }else{
                return 'common'
            }
        },
        getInverstmentStatus: function (code) {
            var reString = this.LEND.inverstmentStatus(code);
            return reString;
        },
        cancelalert(e){
            this.$router.push({name:'Personnal'});
        }
    }
};
</script>
<style scoped>
.myinvestlist{margin-top: 1.5rem;}

#_investment{position:absolute;z-index:90;width:100%;min-height:100%;background-color:#f5f5f5;overflow:hidden;}
.personnal .header_pl{background-color:#f5f5f5;}
.headerline{position: fixed;top:0;width: 100%;z-index:1000;border-bottom: 1px solid #e6e6e6;height:1.17rem;line-height:1.17rem;text-align: center;font-size:16px;color:#262626;background-color:#fff;margin-bottom:10px;}
.headerline img{position:absolute;left:0;height: 1.17rem;z-index: 91;padding: 0.4rem;float: left;}
.myinvesttype{margin-bottom:10px;}
.myinvesttype .tl_myinvesttype{font-size:14px;color:#262626;text-align:left;height:1.75rem;padding:.4rem;background-color:#fff;border-bottom:1px solid #e6e6e6;}
.myinvesttype .tl_myinvesttype div{display: inline-block;width:70%;}
.myinvesttype .tl_myinvesttype div p:nth-child(1){color:#262626;}
.myinvesttype .tl_myinvesttype div p:nth-child(2){font-size:12px;color:#999;margin:.27rem 0 .4rem 0;}
.myinvesttype .tl_myinvesttype >.investstatus{display:inline-block;position: absolute;right:.4rem;margin-top: .7rem;}
.myinvesttype .tl_myinvesttype >.active{color:#509fff;}
.myinvesttype .tl_myinvesttype >.darkcolor{color:#999;}
.myinvesttype .ct_myinvesttype{padding:.4rem;font-size:16px;color:#262626;text-align:left;background-color:#fff;}
.myinvesttype .ct_myinvesttype p{margin-bottom:.2rem;color:#999;}
.myinvesttype .ct_myinvesttype p span:nth-child(2){position:absolute;right:.4rem;color:#595959;}
.more_loading>span:first-child{
    display: inline-block;
}
</style>

