<template>
<div id="_logs">
    <div class="header_pl">
        <div class="header_box">
            <div class="headerline">
                <img src="../../../static/images/icon/pic_navb.png" @touchend="cancelalert" alt="back"> 
                <p style="text-align:center;">Transaction History</p>
            </div>   
            <ul class="li_logs">
                <li class="li_" :class="(now_log=='deposit')?'active':''" @touchend="changenow_log('deposit')">Deposit History</li>
                <li class="li_" :class="(now_log=='withdraw')?'active':''" @touchend="changenow_log('withdraw')">Withdrawal History</li>
            </ul> 
        </div>
        <div class="myloglist" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <transition-group name="lendchainfade1">
            <div class="mylog" v-for="(item,index) in loglist" :key="index" v-tap="{methods:toggleshow,name:'tap',id:item.id}">
                <div class="tl_mylog">
                    <span>{{formatStatus(item.status)}}</span>
                    <span>{{item.amount}}&nbsp;{{item.cryptoCode}}</span>
                </div>
                <div class="ct_mylog">
                    <span>{{item.ctime}}</span>
                    <span>order number: {{now_log=='deposit'?item.orderId:item.txOrder}}</span>
                </div>
                <transition name="lendchainfade0">
                <div class="ft_mylog" v-if="item.showaddr">
                  <p>Deposit Address:&nbsp;{{item.addr.addr}}</p>
                  <p v-if="now_log=='deposit'">Hash:&nbsp;{{item.orderId}}</p>
                </div> 
                </transition>
                 <div v-if="false" class="ft_myinvesttype" @touchend="showpetty(item.id)">Click to read more&nbsp;&nbsp;>></div>
            </div>
            <!--底部判断是加载图标还是提示"全部加载"-->
            </transition-group> 
            <div class="li_ accelerate" v-if="(now_log=='deposit')" style="position: fixed;width:100%;padding:0 .4rem;bottom: 0px;height: 2.88rem;display: flex;background-color: #fff;flex-direction: column;justify-content: center;align-items: center;border-top: 1px solid #eee;">
             <div class="confirmaccelerate" @click="togglesm">Accelerate recharge</div>
             <p>Note:After the transaction is successfully initiated on the blockchain,the acceleration of recharge can be performed.</p>
             </div>
             <div class="supplement" v-if="showsm">
                <div class="supplement-container">
                    <div class="supplement-box">
                        <div class="supplement-head">
                            <span>Accelerate recharge</span>
                            <img @click="hidesm" src="../../../static/images/icon/cancel_alert.png" alt="" srcset="">
                        </div>
                        <div class="supplement-body">
                            <div class="accelerate-coin">
                                    <div class="selaccelerate-coin" @touchend="sm.isshow=!sm.isshow">
                                        <span class="selaccelerate-coinname" :class="{nocoinname:sm.uniqueId_cyptoCode==''}" 
                                        v-html="sm.uniqueId_cyptoCode?sm.uniqueId_cyptoCode:'Select currency'"></span>
                                        <img class="selaccelerate-arrow" :class="{rotate:sm.isshow}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAcCAYAAAC+lOV/AAAA00lEQVQ4T73VvQ3CMBCG4e8kxADsBQgQPVTxRJHtEfgpYSsGgOaQIyVKiH/uXJD+eZ1Y9oWccy2AAzOfjTFPKB5yzr0ArAB8mHmnCZD3fsPMVwBLbYDCW1prt0R06QMA9k3TPEpf0OHawIBrAhOsDcywJhDF0kASSwJZXAoUcQj8HqT+HIhwLBCOshiPAncACwDv/+DYBRKtXL1hKRj2ILtyDmZxCSaxBEaxFM6wBk6wFg64BnbYWrsmopt2cnZ4PPSlI7efuAGH380RwEkyq8ez/AsEbdnHTFEhEgAAAABJRU5ErkJggg==" alt=""/>
                                    </div>
                                    <ul class="accelerate-coinbox" v-show="sm.isshow">
                                        <li class="accelerate-coinitem" :class="{selected:item.cyptoCode==sm.uniqueId_cyptoCode}"
                                        v-for="(item) in uniqueIds" 
                                        @touchend="changeacceleratecoin(item)"
                                        :key="item.id" v-html="item.cyptoCode"></li>
                                    </ul>
                            </div>
                            <div class="accelerate-coin">
                                <input type="text" v-model="sm.hash_sm" class="selaccelerate-coin" placeholder="Enter your Hash"/>
                            </div>
                            <div class="accelerate-btn">
                                <button @click="submit_sm">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="more_loading" v-show="loading" style="padding: 8px 0;">
                <mt-spinner type="fading-circle" color="#509fff" :size="20" v-show="loading&&!isLastPage"></mt-spinner>
                <span v-show="isLastPage" style="color:#999">no more data</span>
            </div>
        </div>
        <!-- <div v-show="noMoreData"></div> -->
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            act: "",
            now_log: 'deposit', //默认为deposit,表示充值记录  withdraw表示提现记录
            ids:[], //用于存放所有的记录的相关ID值，用于去重
            loglist: [], //渲染列表
            page: 1, //默认第一页
            page_size: 10, //默认每页10条数据
            isLastPage: false, //是否是最后一页,默认为false
            loading: false, //默认开始允许下拉
            withdrawShow:false,
            // noMoreData:false, //显示暂无更多数据
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
             showsm:false,
            uniqueIds:[],
            sm:{
                uniqueId_sm:'', //选择币种
                hash_sm:'hash_sm', //请输入充值Hash
                uniqueId_cyptoCode:'', //币种名称
                isshow:false //是否展示更多币种选择
            },
            rules:{ //校验规则
                "ETH":{
                    reg:'^0x[a-z0-9]{64}$',
                    tip:'66-bit string starting with 0X (string consists of lowercase letters and numbers)'
                },
                "QKC":{
                    reg:'^0x[a-z0-9]{64}$',
                    tip:'66-bit string starting with 0X (string consists of lowercase letters and numbers)'
                },
                "BTC":{
                    reg:'^(?![^a-zA-Z]+$)(?!\D+$){64}',
                    tip:'64-bit string (string consists of lowercase letters and numbers)'
                },
                "USDT":{
                    reg:'^(?![^a-zA-Z]+$)(?!\D+$){64}',
                    tip:'64-bit string (string consists of lowercase letters and numbers)'
                }
            }
       };
    },
    methods: {
        loadMore() { //页面刚加载默认会加载一次
            this.loading = true;
            this.changenow_log(this.now_log, this.page, this.page_size);
        },
       /*  showpetty:function(id){
            let nextData=this.loglist.filter((item)=>{
                return item.id==id
            })[0]
            console.log(nextData.id)
            this.$router.push({path:'/LogDetail',query:nextData});
        }, */
        changenow_log(now_log, page, page_size) {
            if (this.now_log != now_log) { //如果跟之前的不同,就重置相关选项
                this.page = 1;
                this.ids = [];
                this.loglist = [];
                this.isLastPage = false;
                this.now_log = now_log; //高亮当前的选项头部栏
                window.scrollTo(0, 0);
            }
            if (this.isLastPage) {
                setTimeout(()=>{
                    this.loading = false;    
                },500);
                return;
            }
            let formatData = {
                page: page || 1,
                page_size: page_size || 10
            };
            let url_now_log = now_log == 'deposit' ? "/trade/deposit/index" : "/trade/withdraw/index";
            this.$axios.get(url_now_log, { params: formatData}).then(res => {
                if (Number(res.code) == 2000) {
                    // if(this.page==1 && !res.data.length){
                    //     this.noMoreData = true;   
                    // }
                    this.loading = false;
                    res.data.forEach( (i) => {
                        i.ctime = this.LEND.timeToLocal(i.ctime);
                        i.showaddr = false; //默认充值地址都为隐藏
                        if(this.ids.indexOf(i.id)==-1){  //id用于去重
                            this.ids.push(i.id);
                            this.loglist.push(i);
                        }
                    });
                    // this.loglist = this.loglist.concat(res.data);
                    if (res.data.length < this.page_size) { //返回的条数小于默认的条数
                        this.isLastPage = true; //已经是最后一页 
                    } else {
                        this.page++;
                    }
                } else {
                }
            });
        },
        formatStatus(val){
            if(this.now_log == 'deposit'){
              return this.LEND.depositStatus(val);
            } else {

               return this.LEND.withdrawStatus(val);
            }
        },
        toggleshow: function(data) {
            if(this.now_log=='withdraw'){ //提现记录不让点击
               return;
            }
            this.loglist = this.loglist.filter(item => {
                item.id == data.id && (item.showaddr = !item.showaddr);
                return item.id != -2000;
            });
        },
        cancelalert(e) {
            this.$router.push({name:'Personnal'});
        },
         togglesm:function(){
            this.getconlist()
            this.sm.hash_sm=''
            this.showsm=!this.showsm;
        },
        hidesm:function(){
            this.showsm=false;
        },
        getconlist:function(){
            let whitelist=["GXS","LV"] //不可加速白名单
             this.$axios.get('/trade/crypto/list',{params: {'access_token':this.LEND.localStorage('access_token')}}).then( res => {
                switch(Number(res.code)){
                    case 2000:
                         this.uniqueIds=res.data.filter((item) => {
                            return !whitelist.includes(item.cyptoCode)
                        })
                         this.sm.uniqueId_sm=res.data[0].uniqueId
                    break;
                }
             })
        },
        changeacceleratecoin(item){ //选择加速币种
            this.sm.uniqueId_sm=item.uniqueId
            this.sm.uniqueId_cyptoCode=item.cyptoCode
            this.sm.isshow=false
        },
        submit_sm:function(){
            if(this.sm.hash_sm.toString().length<=0){
                this.$toast({message:'The hash can not is null',className:'shouldhash',duration:2000})
                return false
            }else if(this.sm.uniqueId_cyptoCode==''||Number(this.sm.uniqueId_sm)<100000){
                  this.$toast({message:'Currency not selected',className:'shouldhash',duration:2000})
                     return false
            }else if(
                (this.sm.uniqueId_cyptoCode.toUpperCase()=='ETH'||this.sm.uniqueId_cyptoCode.toUpperCase()=='QKC')&&!new RegExp(/^0x[a-z0-9]{64}$/).test(this.sm.hash_sm)
            ){
                this.$toast({message:this.rules[this.sm.uniqueId_cyptoCode.toUpperCase()].tip,className:'shouldhash',duration:2000})
                return false
            }else if(
                // /^(?=.*[a-z])(?=.*\d)[a-z\d]+$/
                (this.sm.uniqueId_cyptoCode.toUpperCase()=='BTC'||this.sm.uniqueId_cyptoCode.toUpperCase()=='USDT')&&
                !new RegExp(/^(?!([a-z]+|\d+)$)[a-z\d]{64}$/).test(this.sm.hash_sm)
            ){
                this.$toast({message:this.rules[this.sm.uniqueId_cyptoCode.toUpperCase()].tip,className:'shouldhash',duration:2000})
                return false
            }
              this.$axios.post('/trade/deposit/supplement', {
                  'access_token':this.LEND.localStorage('access_token'),
                  'uniqueId':this.sm.uniqueId_sm||'',
                  'hash':this.sm.hash_sm||''
                        }).then(res => {
                            switch(Number(res.code)){
                                case 2000:
                                 this.showsm=!this.showsm;
                                 this.$toast({message:res.message,className:'shouldhash',duration:2000})
                                break;
                                case -1:
                                this.showsm=!this.showsm;
                                this.$toast({message:res.message,className:'shouldhash',duration:2000})
                                break;
                            }
                        })
        }
    }
}
</script>
<style scoped>
#_logs {
  width: 100%;
  background-color: #f5f5f5;
  overflow: scroll;
}
.personnal .header_pl {
  background-color: #f5f5f5;
}
.headerline {
  height: 1.17rem;
  line-height: 1.17rem;
  font-size: 16px;
  color: #262626;
  background-color: #fff;
}
.headerline img {
  position:absolute;left:0;
  height: 1.17rem;
  z-index: 91;
  padding: 0.4rem;
  float: left;
}
.li_{
  text-align: center;
}
.li_logs{
    width: 100%;
    display:flex;
    flex-direction: row;
}
.li_logs li {
  flex: 1;
  font-size:14px;
  padding: 0.35rem 0;
  background-color: #fff;
}
.li_logs .active {
  color: #509fff;border-bottom: 2px solid #509fff;
}
.myloglist {
  margin-top: 2.5rem;
}
.myloglist .mylog {
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}
.myloglist .mylog .tl_mylog {
  font-size: 16px;
  text-align: left;
  padding: 0.4rem;
}
.myloglist .mylog .tl_mylog span:nth-child(2) {
  color: #509fff;
  position: absolute;
  right: 0.4rem;
}
.myloglist .mylog .ct_mylog {
  font-size: 12px;
  text-align: left;
  padding: 0 0.4rem;
  margin-bottom: 0.5rem;
}
.myloglist .mylog .ct_mylog span:nth-child(2) {
  position: absolute;
  right: 0.4rem;
  display: inline-block;
  max-width: 5.5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

}
.myloglist .mylog .ft_mylog {
  width: 100%;
  word-wrap: break-word;
   /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
height: 1.07rem;*/
  line-height: 1.07rem;
  font-size: 12px;
  color: #999;
  text-align: left;
  padding-left: .4rem;
  background-color: #ebf4ff;
}
.myloglist .mylog .ft_mylog p{padding-right:.4rem;}
.myloglist .mylog .ft_mylog p:nth-child(2){line-height: initial;}
.ft_myinvesttype{height: 1.07rem;line-height: 1.07rem;font-size: 12px;text-align: center;color: #509fff;background-color: #ebf4ff;}
.more_loading{
    text-align: center;
}
.more_loading>span:first-child{
    display: inline-block;
}
.header_box{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;
}
.supplement{
    position:absolute;
    width:100%;
    height:100%;
    padding:0px 0.8rem;
    top:0;
    background-color:rgba(0,0,0,.4);
    z-index:10000;
}
.supplement .content_sm{margin-top:40%;padding-bottom:1rem;background-color: #fff;border-radius:3px;}
.supplement .content_sm .hd_sm{position: relative;height:28px;line-height: 28px;margin-bottom:20px;padding-top:20px;font-size: 0.42rem;text-align: center;}
.supplement .content_sm .hd_sm img{position:absolute;width:15px;right:.4rem;}
.supplement .content_sm table tr{height: 1.33rem;line-height: 1.33rem;font-size:0.37rem;}
.supplement .content_sm table tr td:first-child{padding-left:.4rem;text-align: right;}
.supplement .content_sm table tr td:last-child{padding-right:.4rem;width:100%;}
.supplement .content_sm table tr select,.supplement .content_sm table tr input{width:100%;padding-left:10px; height: 1rem;line-height: 1rem;}
.supplement .content_sm .commonbtn{width:80%;margin:1rem auto 0;}
/*充值加速选择币种*/
.supplement-container{
    width: 100%;
    height: 100%;
    display:flex;
    justify-content:center;
    align-items:center;
    box-sizing: border-box;
}
.supplement-container .supplement-box{
    width: 100%;
    height: 7.47rem;
    border-radius: 0.13rem;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}
.supplement-box .supplement-head{
    width: 100%;
    height: 1.32rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #E5E5E5;
    position: relative;
}
.supplement-head span{
    font-size: 0.43rem;
    color: #262626;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
}
.supplement-head img{
    width: 0.4rem;
    position: absolute;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%);
}
.supplement-body{
    padding: 0.53rem 0.8rem 0px 0.8rem;
}
.accelerate-coin{
    width: 100%;
    height: 1.17rem;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 0.53rem;
}
.selaccelerate-coin{
    display: flex;
    width: 100%;
    height: 100%;
    border: 1px solid #E5E5E5;
    align-items: center;
    justify-content: space-between;
    padding:0px 0.41rem;
    outline: none;
}
.selaccelerate-coin span.nocoinname{
    color: #ccc;
    font-size: 0.37rem;
}
.selaccelerate-coin .selaccelerate-arrow{
    height: 0.37rem;
    transform: rotate(90deg);
    transition: all 0.3s linear;
}
.selaccelerate-coin .selaccelerate-arrow.rotate{
    transform: rotate(270deg);
}
.accelerate-coinbox{
    position: absolute;
    left: 0px;
    top: 100%;
    z-index: 50;
    width: 100%;
    max-height: 3.3rem;
    overflow-y: scroll;
    border:1px solid #E5E5E5;
    border-top: none;
    background-color: #fff; 
    box-sizing: border-box;
}
.accelerate-coinbox .accelerate-coinitem{
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.1rem;
    padding-left: 0.41rem;
    border-top: 1px solid #E5E5E5;
}
.accelerate-coinbox .accelerate-coinitem.selected{display:none;}
.accelerate-coinbox .accelerate-coinitem:first-child{border-top: 0px;} 
.accelerate-btn{
    padding-top: 0.12rem;
    width: 100%;
}
.accelerate-btn button{
    border: 0px;
    outline: 0px;
    width: 100%;
    height: 1.17rem;
    background: linear-gradient(to right,#509FFF,#4885FF);
    border-radius: 0.05rem;
    font-size: 0.43rem;
    color: #FFFFFF;
    box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
}
.confirmaccelerate{
    width:100%;
    height:1.17rem;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:0.43rem;
    color:#fff;
    border-radius: 0.05rem;
    margin:0px auto 0.42rem;
    background: linear-gradient(to right,#509FFF,#4885FF);
    box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
}
</style>
<style>
body .shouldhash{z-index:10008 !important;}
</style>
