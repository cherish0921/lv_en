<template>
<div id="logdetail">
     <div class="header_box">
        <div class="headerline">
            <img src="../../../../static/images/icon/pic_navb.png" @touchend="cancelalert" alt="back"> 
            <p style="text-align:center;">Withdrawal Details</p>
        </div>   
    </div>
    <div class="coinname">
        <p>Coin</p>
        <p class="name">{{jquery.cryptoCode}}</p>
    </div>
    <div class="detailinfo">
        <p><span>Amount</span><span>{{jquery.amount}}</span></p>
        <p id="status"><span>Status</span><span>{{formatStatus(jquery.status)}}</span></p>
        <p><span>Address</span><span>{{jquery.addrTo.addr}}</span></p>
         <p v-if="jquery.addrTo.memo"><span>Txid</span><span>{{jquery.addrTo.memo}}</span></p>
        <p><span>Txid</span><span id="txorder">{{jquery.txOrder}}</span></p>
        <p><span>Prepayment Time</span><span>{{getCtime(jquery.amount)}}</span></p>
    </div>
    <div class="actionbtns">
        <div class="actionbtn borderlblue" ref="copy" data-clipboard-action="copy"  data-clipboard-target="#txorder" @touchend="copytxid('copy')">Copy Txid</div>
        <div class="actionbtn bgblue">Check Txid</div>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return {
            now_log:'Withdrawal',
            jquery:this.$route.query, //从上一级路由拿到的数据对象
        }
    },
    mounted(){
         this.copyBtngv = new this.clipboard(this.$refs.copy);
    },
    methods:{
        cancelalert:function(){
            this.$router.go(-1)
        },
        formatStatus(val){
            if(this.now_log == 'deposit'){
              return this.LEND.depositStatus(val);
            } else {
               return this.LEND.withdrawStatus(val);
            }
        },
        getCtime(timestring){
            return this.LEND.timeToLocal(timestring);
        },
        copytxid(query){
         let clipboard =this.copyBtngv;
            clipboard.on('success', (e) =>{
              this.$toast('successful environmentcopy')
            });
            clipboard.on('error', function(e) {
                this.$toast('This environment does not support fast copying, please manually select again')
            });    
        }
    }
}
</script>
<style>
#logdetail{position:absolute;width:10rem;height:1000px;min-height: 100%;background-color:#f5f5f5;z-index:10001;}
.headerline {height: 1.17rem; line-height: 1.17rem;font-size: 16px;color: #262626;background-color: #fff;}
.headerline img {position:absolute;left:0;height: 1.17rem;z-index: 91;padding: 0.4rem;float: left;}
.coinname{margin:10px 0;padding:.55rem 4.4rem;font-size:12px;color:#999;text-align:center;background-color:#fff;}
.coinname .name{font-size:24px;color:#262626;margin-top:.35rem;}
.detailinfo #status{border-bottom:1px solid #e6e6e6;}
.detailinfo p {height:1rem;line-height:1rem;padding:0 .4rem;background-color:#fff;color:#999;text-align:left;}
.detailinfo p span:last-child{float:right;color:#262626;}
.actionbtns{margin: .7rem .8rem;display: flex;justify-content: space-between;}
.actionbtns .actionbtn{display:inline-block;height:1rem;width:46%;;line-height:1rem;text-align:center;font-size:16px;border:1px solid #509fff;border-radius:4px;color:#509fff;}
.actionbtns .bgblue{border:0;color:#fff;background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));}
</style>

