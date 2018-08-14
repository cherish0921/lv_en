<template>

  <div class="index">
    <div class="banner_" style="height:5.6rem;">
      <mt-swipe>
        <!-- ICO活动 -->
        <!-- <mt-swipe-item>
          <router-link to="/tokensale" class="myCountdownbanner">
            <img src="../../../static/images/tokensale/tokensalebanner.png" alt="">
            <div class="mytokensale-index">
              <div class="mytokensaletit-index">
                  <div class="subtit-index" v-if="activityinfo.status==0">Begin in</div>
                  <div class="subtit-index" v-else-if="activityinfo.status==1">Remaining time of the activity</div>
                  <div class="subtit-index" v-else-if="activityinfo.status==2">End in</div>
              </div>
              <div class="myCountdown-banner">
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.d"></div>
                      <div class="Countdown-desc">Days</div>
                  </div>
                  <div class="myCountdown-bannericon">
                      <span></span>
                      <span></span>
                  </div>
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.h"></div>
                      <div class="Countdown-desc">Hours</div>
                  </div>
                  <div class="myCountdown-bannericon">
                      <span></span>
                      <span></span>
                  </div>
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.m"></div>
                      <div class="Countdown-desc">Mins</div>
                  </div>
                  <div class="myCountdown-bannericon">
                      <span></span>
                      <span></span>
                  </div>
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter"  v-html="activityinfo.timertxt.s"></div>
                      <div class="Countdown-desc">Secs</div>
                  </div>
              </div>
              <div class="Countdown-footer justcenter" v-if="activityinfo.status!=2">
                <img src="../../../static/images/tokensale/notokenstart.png"
                 class="img-response" alt="" v-if="activityinfo.status==0"/>
                 <img src="../../../static/images/tokensale/tokenactive.png" 
                 alt="" srcset="" v-if="activityinfo.status==1"/>
              </div>
            </div>
          </router-link>
        </mt-swipe-item> -->
        <!-- 靠海行动 -->
        <mt-swipe-item>
          <router-link to="/recommendact" v-if="ishaslogin">
            <img src="https://s.lendx.vip/static/en/images/tokensale/khactivity.png" alt="">
          </router-link>
          <router-link to="/Login" v-else>
            <img src="https://s.lendx.vip/static/en/images/tokensale/khactivity.png" alt="">
          </router-link>
        </mt-swipe-item> 
        <mt-swipe-item v-for="(item,index) in items" :key="index">
          <a :href="item.href"><img :src="item.url" alt="" srcset=""></a>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <mt-swipe ref="swipe" class="suggest_" :auto=0> 
      <li is="mt-swipe-item" v-for="(item,index) in suggestList" :key="index">
          <div class="suggestItem font16">
            <div class="header">
               <div class="title">{{item.orderId}}<br><span class="font11 darktipcolor">({{item.nickname||"Platform"
                 }})</span></div>
            </div>
            <div class="content_">
              <p> {{item.borrowDays}}-day period</p>
              <div class="circleloading circleloadinglg">
                <svg width="2.95rem" height="2.95rem" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="65" stroke-width="10" stroke="#a5ccff" fill="none"></circle> <circle :id="'sc'+item.id" cx="70" cy="70" r="65" stroke-width="10" stroke="#509fff" fill="none" transform="matrix(0,-1,1,0,0,140)" :stroke-dasharray="circleanimate(70,item.boughtAmount,item.borrowAmount)" ></circle>
                </svg> <div class="circleinfo"><span class="font12 darktipcolor">rate (year)</span> <br> <span class="gradient_fontco"><i class="font32 " style="font-size:26px;">{{annualized(item.interestRates)}}</i>%</span></div></div>
              <div class="borrowin font12"><div class="left"><span><i class="blueicon"></i>{{fixFloat(item.borrowAmount)}}{{item.borrowCryptoCode}}</span> <br> <span class="font11 darktipcolor">Borrow assets</span></div> 
                  <div v-if="item.nickname" class="right"><span><i class="blueicon"></i>{{fixFloat(item.mortgageAmount)}}{{item.mortgageCryptoCode}}</span> <br> <span class="font11 darktipcolor">Mortgage assets</span></div>
                  <div v-if="!item.nickname" class="right"><span><i class="blueicon"></i>{{computedlimit(item.borrowCryptoCode,true)}}{{item.borrowCryptoCode}}</span> <br> <span class="font11 darktipcolor">The minimum limit</span></div>
                </div>
              <div class="commonbtn gradient_blue" v-tap="{methods:goinverst,name:'tap',id:item.id,borrowCryptoId:item.borrowCryptoId}"><span class="font22">Invest</span></div>
            </div>
          </div>
      </li>
    </mt-swipe> 
    <div class="market">
      <h3 class="font16">Market</h3>
       <transition-group name="lendflip-list1" tag="div">
        <table  class="font14" v-for="(item,index) in spList" :key="index"  v-tap="{methods:changeshowmore,name:'tap',index:index}">
          <tr class="tabletitle" v-if="index==0"><td>Coin</td> <td>Last Price</td> <td>24H Change</td></tr>
          <tr id="sptr0"><td>{{item.pairCode}}</td> <td>{{(item.newprice).toFixed(2)}}<br><span class="darkcolor">${{getcnyprice(item.newprice)}}</span></td> <td :class="((item.increase>0)?'rise':'fall')">{{parseFloat(item.increase*100).toFixed(2)}}%</td> </tr>
          <tr class="show font12" id="asptr0" v-if="item.showmore">
            <td>24H High<span>{{(item.high).toFixed(2)}}</span></td><td>24H Low<span>{{(item.low).toFixed(2)}}</span></td> <td>24H Curve 
             
             <ve-line :data="item.chartdata"  :xAxis="xAxis" :yAxis="yAxis" :judge-width="true" height="60px" width='100%'
            :tooltip-visible="false"  :legend-visible="false" style="text-align:right;"></ve-line>
            </td>
          </tr>
        </table>
      </transition-group> 
    </div>

              
  </div>
</template>

<script>
import { mapState,mapGetters,mapActions } from 'vuex'
var startX = 0;
var animateArr = [];
export default {
  name: "index",
  data() {
    this.chartSettings = {}
     this.grid = {
        show: true,
        width:'100%',
         top: 0,
        right:'0%',
        padding:0,
        margin:0,
        containLabel: true,
        backgroundColor: '#ccc',
        borderColor: '#000'
      }
    return {
    //  blockchain:this.$store.state.blockchain,
      msg: "lendchain",
      suggestList:[],
      spList:[],
      xAxis: [{
        show: false,
        nameGap:0,
        boundaryGap:0,
        axisLine:false,
        axisTick:false,
        axisLabel:false,
        boundaryGap: 0,
        splitLine: { show: false },
        data: []
    }],
    
    yAxis: [{
        show: false,
        nameGap:0,
        boundaryGap:0,
        axisLine:false,
        axisTick:false,
        axisLabel:false,
        boundaryGap: 0,
       // huilv:0,
        splitLine: { show: false },
        min: function min(value) {
            return value.min;
        }
    }],
     items: [
        {
          title: '安全披露',
          href: 'https://info.lendx.vip/h5event/lend_a0713/index.html?lang=en&env=webapp',
          url: 'https://s.lendx.vip/static/images/Index/bannner3_en.png?t=20180713'
        }, {
          title: '下载',
          href: 'https://info.lendx.vip/h5event/lend_a0628/index.html?lang=en&env=webapp',
          url: 'https://s.lendx.vip/static/images/Index/bannner2_en.png?t=20180713'
        },],
        /*add wkx */
      activityinfo: {   //活动信息
                readyday: null,//new Date("2018", "6", "23", "12", "00", "00"), //准备时间
                nowtime:  null,//new Date("2018", "6", "24", "14", "08", "00").getTime(), //当前时间
                starttime: null,//new Date("2018", "6", "24", "14", "16", "40").getTime(), //开始时间
                endtime: null,//new Date("2018", "6", "24", "14", "17", "00").getTime(), //结束时间
                status: 0, //活动状态 0 预热 1 活动中 2结束
                timer:null , //计时器ID
                timertxt:{ //倒计时天，时，分，秒
                    d:'',
                    h:'',
                    m:'',
                    s:''
                }
            }
    };
  },
  created(){ /*add wkx ICO公募*/
    // let faillist=[undefined,false,true,NaN,Infinity,null,'','undefined','false','true','NaN','Infinity','null']
    // if(
    //   faillist.includes(this.LEND.localStorage('tokensalestarttime'))||
    //   faillist.includes(this.LEND.localStorage('tokensaleendtime'))
    // ){
    //   this.icogettime() //请求ICO准备时间
    // }else{
    //   let startime=parseInt(this.LEND.localStorage('tokensalestarttime')),endtime=parseInt(this.LEND.localStorage('tokensaleendtime'))
    //   this.activityinfo.starttime=startime
    //   this.activityinfo.endtime=endtime
    //   this.startCountdown()
    // }
  },
  mounted(){
    /*     //获取汇率
        this.$axios.get(this.Posturl+'/price/latest',{params:{symbol:1099}}).then((result2) =>{
                  if((result2.code)==='ok'){
                    this.$data.huilv=result2.data.price
                    }
                }) */
        this.changeState({type:'isloading',value:true})
    //获取推荐标
        this.$axios.get('/trade/invest/recommends').then( res => {
            if(res.data){
                var suggestList = res.data;
                this.suggestList = suggestList;
            }
        })
        //获取实时价格
         this.$axios.post(this.Posturl+'/price/market',{}).then((result) =>{
           if((result.code)==='ok'){
            for(let k in result.data){
               let obj=result.data[k]
               obj.increase=((obj.close-obj.open)/obj.open).toFixed(4)
               obj.showmore=false
               //
            // pairId
             this.$axios.get(this.Posturl+'/price/fullPrice',{params:{symbol:obj.pairId}}).then((result1) =>{
              if((result1.code)==='ok'){
                obj.chartdata={columns: ['price', 'price'], rows:result1.data.reverse()} }
                this.$axios.get(this.Posturl+'/price/latest',{params:{symbol:obj.pairId}}).then((result2) =>{
                  if((result2.code)==='ok'){
                    obj.newprice=result2.data.price
                    this.spList.push(obj)
                    }
                })
                
             })
             }
           }
           this.changeState({type:'isloading',value:false})
         });
  /*        this.$axios.get(this.Posturl+'/price/latest',{symbol:1000}).then( result => {
           if(result.code ==='ok'){
               this.spList = result.data;
           }
         }); */
  },
  beforeMount() {
   
  },
  computed:{
    ishaslogin(){
        let faillist=[undefined,false,NaN,Infinity,null,'','undefined','false','NaN','Infinity','null']
        if(faillist.includes(this.LEND.localStorage('haslogin'))){
          return false
        }else{
          return true
        }
    }
  },
  destroyed(){  //add wkx
        clearInterval(this.activityinfo.timer)
        this.activityinfo.timer=null
    },
  methods: {
        icogettime(){ //获取请求ICO准备时间 add wkx
            this.$axios.get('/trade/ico/getTime',{}).then((res) => {
                if(res.code==2000){
                    this.activityinfo.nowtime=new Date(parseInt(res.data.now)).getTime()
                    this.activityinfo.starttime=new Date(parseInt(res.data.start)).getTime()
                    this.activityinfo.endtime=new Date(parseInt(res.data.end)).getTime()
                    this.LEND.localStorage('tokensalestarttime',this.activityinfo.starttime)
                    this.LEND.localStorage('tokensaleendtime',this.activityinfo.endtime)
                    this.startCountdown()
                }
            })
        },
        startCountdown() { //开启倒计时 add wkx
            let now=new Date().getTime()
            if(now<this.activityinfo.starttime){ // 活动处于准备阶段
                this.activityinfo.status=0
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.starttime)
                },1000)
            }else if(now>this.activityinfo.starttime&&now<this.activityinfo.endtime){ //活动处于进行阶段
                this.activityinfo.status=1
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.endtime)
                },1000)
            }else if(now>this.activityinfo.endtime){ //活动结束
                clearInterval(this.activityinfo.timer)
                this.activityinfo.timer=null
                this.activityinfo.status=2
                this.activityinfo.timertxt.d='00'
                this.activityinfo.timertxt.h='00'
                this.activityinfo.timertxt.m='00'
                this.activityinfo.timertxt.s='00'
            } 
        },
        leftTimer(endtime) { //计算倒计时 addwkx
            let leftTime=endtime-new Date().getTime()
            let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            let hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
            let minutes = parseInt((leftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
            let seconds = parseInt((leftTime / 1000) % 60, 10); //计算剩余的秒数
            days = this.checkTime(days);
            hours = this.checkTime(hours);
            minutes = this.checkTime(minutes);
            seconds = this.checkTime(seconds);
            if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) { //开启定时器
                this.activityinfo.timertxt.d=days
                this.activityinfo.timertxt.h=hours
                this.activityinfo.timertxt.m=minutes
                this.activityinfo.timertxt.s=seconds
            }
            if (parseInt(days) <= 0 && parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) { //清除定时器
                this.activityinfo.timertxt.d='00'
                this.activityinfo.timertxt.h='00'
                this.activityinfo.timertxt.m='00'
                this.activityinfo.timertxt.s='00'
                if(this.activityinfo.status==0||this.activityinfo.status==1){ //活动处于进行阶段
                    this.startCountdown()
                }else{ //活动结束
                    clearInterval(this.activityinfo.timer)
                    this.activityinfo.timer=null
                }
            }
        },
        checkTime(i) {  //处理小于10的时间字段 add wkx
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
            circleanimate: function(cx, had,all) {
            //  circleanimate(document.querySelector('.circleloadinglg svg circle:last-child'), 35.8); //调用示例
            let percent = Number(had) / Number(all);
             return (Math.PI * 2 * cx*percent+ " " + Math.PI * 2 * cx*(1-percent))
        },
        annualized:function(interest){
      //根据天数来分别发挥年化或者日利率
         return (interest*100*360).toFixed(2)
    },
        getcnyprice:function(val){
      return this.LEND.fixFloat(val) //this.LEND.fixFloat(Number(this.$data.huilv)*Number(val))
    },
    fixFloat: function fixFloat(val) {
          return this.LEND.fixFloat(val);
    },
    changeshowmore(param){
      let i=param.index
      this.$data.spList[i].showmore=! this.$data.spList[i].showmore
 //this.$set(this.$data, 'suggestList', suggestList);
    },
   gogift:function(){
        let blockchain = this.$store.state.blockchain;
        if(blockchain==-1){  //布洛克城外没登录的话允许后退到原来的路由
            if(this.$store.state.haslogin){
                this.$router.push({ name:'Gift',query:{redirect:'/Index'}});
            }else{
                this.$router.push({ name:'Login'});   
            }
        }else if(blockchain == 0){  //布洛克城内没绑定的话去绑定页面
          this.$router.push({ name:'UserCenterNoBind'});
        }else if(blockchain == 1){  //布洛克城内绑定过的话去推荐页面
          this.$router.push({ name:'Gift',query:{redirect:'/Index'}});
        } 
    },
    goinverst:function(params){
        this.$router.push({ name:'Investmentinfo', query:{id:params.id,borrowCryptoId:params.borrowCryptoId}})
    },
    computedlimit(cointype,ismin){
        //ismin 不获取新手标最大投资额度 ，即要获取新手标最小投资额度
        switch(cointype){
          case 'BTC':
            return  ismin?0.01:0.2
          break;
          case 'GXS':
            return ismin?20:500
          break;
          case 'ETH':
            return ismin?0.1:2
          break;
          case 'USDT':
            return ismin?100:1000
          break;
          default:
          break;
        }
      },
    ...mapActions(['changeState'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
@import "./Index.scss";
</style>

