<template>
<!--    @touchstart="movestart" @touchmove="moving" @touchend="moveend" -->
  <div class="Investment iteminfos">
    <router-view/>
    <div class="topnav font16" @touchend="backhistory">
      <img src="../../../static/images/icon/pic_nav.png" alt="" srcset="">
      {{hoverItem.orderId}}
    </div>
    <div id="refreshContainer">
    <div class="module2">
      <p>({{hoverItem.nickname||'Platform'||''}})</p>
      <p>{{annualized(hoverItem.interestRates,hoverItem.borrowDays)}}%</p>
      <p>Rate (year)</p>
      <div class="info clearfloat">
        <div class="info1"><span>{{hoverItem.borrowDays}} days</span><br><span>Period</span></div>
        <div class="info2"><span>{{fixFloat(hoverItem.borrowAmount||0)}}&nbsp;{{hoverItem.borrowCryptoCode}}</span><br><span>Borrowed</span></div>
        <div v-if="hoverItem.borrowTypeId==1" class="info3"><span>{{fixFloat(hoverItem.mortgageAmount||'')}}&nbsp;{{hoverItem.mortgageCryptoCode}}</span><br><span>Mortgaged</span></div>
      </div>
      <div v-if="hoverItem.borrowTypeId>3" class="priceing">New user remaining  aomount {{buydata.limitremain}}&nbsp;{{hoverItem.borrowCryptoCode}}</div>
      <div v-if="hoverItem.borrowTypeId==1" class="priceing">Mortgage price&nbsp;{{shijia}}&nbsp;{{hoverItem.borrowCryptoCode}}</div>
    
    </div>
    <div class="incrise">
        <p>Progress</p>
        <div class="pg_item"><span class="lineout"><i class="linein gradient_line"  :style="'width:'+(getboughtPercent(hoverItem.boughtAmount,hoverItem.borrowAmount)*8)+'rem;'">&nbsp;</i></span><span>{{(getboughtPercent(hoverItem.boughtAmount,hoverItem.borrowAmount)*100).toFixed(1)}}%</span></div>
        <p>Available Balance<span>{{((Number(hoverItem.remaincanbuy)<=0)?'0':hoverItem.remaincanbuy)}}</span><span>{{hoverItem.borrowCryptoCode}}</span> </p>
    </div>
    <div class="commoninfo">
        <p class="title_incrise">Basic information</p>
      <div class="table">
        <p><span>Start time</span><span>{{timeTolocal((hoverItem.borrowTypeId==1)?(hoverItem.createTime):(hoverItem.startTime))}}</span></p>
        <p><span>Interest rate method</span><span>calculated after getting full</span></p>
        <p><span>Repayment</span><span>Principal and Interest  repayment</span></p>
        <p><span>The minimum limit</span><span>{{computedlimit(hoverItem.borrowCryptoCode,true)}}&nbsp;{{hoverItem.borrowCryptoCode}}</span></p>
      </div>
    </div>
    </div>
    <div class="moreinfo" v-if="moreinfoshow">
      <ul class="liinfos">
        <li :class="moreinfoli==0?'borderBottom':''" v-tap="{methods:moreinfolifun,name:'tap',moreinfoli:0}">Investment details</li>
        <li :class="moreinfoli==1?'borderBottom':''"  v-tap="{methods:moreinfolifun,name:'tap',moreinfoli:1}">Purchased records</li>
      </ul>
      <div class="moreinfocontent">
        <div  v-if="moreinfoli==0" class="desc">
          {{hoverItem.desc}}
        </div>
        <table v-if="moreinfoli==1">
          <tr>
            <td>User name</td>
            <td>Amount({{hoverItem.borrowCryptoCode}})</td>
            <td>Time</td>
          </tr>
           <tr v-for="(ele) in hoverItem.investList" :key="ele.id">
            <td>{{ele.nickname?ele.nickname.slice(0,8):''}}</td>
            <td>{{ele.amount}}</td>
            <td>{{timeTolocal(ele.time)}}</td>
          </tr>
        </table>     
      </div>
    </div>
    <div class="confirmBtn darkcolor"  v-if="(show_timetext.indexOf(':')>0) ||(hoverItem.status=='1')"> {{show_timetext}}</div>
    <div class="confirmBtn"  v-else-if="show_timetext.indexOf(':')<0" @touchend="gobuy"> {{show_timetext}}</div>
      <inputponent v-show="alertmodule==1"  type="0" :canmin="hoverItem.canmin" :userremain='buydata.userremain' :coinname="buydata.coinname" :interestRates="hoverItem.interestRates" :borrowDays="hoverItem.borrowDays" :remaincanbuy='hoverItem.remaincanbuy' @cancelalert="cancelalert" @gopay="gopay"></inputponent>
       <inputponent v-show="alertmodule==3" type="1" :canmin="hoverItem.canmin" :userremain='buydata.userremain' :coinname="buydata.coinname" :interestRates="hoverItem.interestRates" :borrowDays="hoverItem.borrowDays" :remaincanbuy='hoverItem.remaincanbuy' @cancelalert="cancelalert" @confirmpay="confirmpay"></inputponent>
      <payponent v-show="alertmodule==2" :coinname="buydata.coinname" :userremain='buydata.userremain' :enddateincome="buydata.enddateincome" :buyval='buydata.buyval' @cancelalert="cancelalert" @gorecharge="gorecharge"></payponent>
   
    <!--   <gauthponent v-show="alertmodule==4" type="i" gtext="D67GH6LN7TR2KQBZ" btntext="确认支付" title="谷歌验证" @cancelalert="cancelalert"/> -->
  </div>  
</template>

<script>
import { mapState,mapGetters,mapActions} from 'vuex'
import inputponent from './inputponent'
import payponent from './payponent'
//import gauthponent from './common/gauthcontent.vue'
let busy_axios=false;
let interval
export default {
  name: "Investmentinfo",
  data() {
    return {
      loading:false,//是否在发起ajax请求 
      id:this.$route.query.id,
      alertmodule:0,
      limodule:1,
      hoverItem:{},
      shijia:'',
      moreinfoshow:true,//显示标的详情
      moreinfoli:0,
      nowPrice:'',
      show_timetext:'',//显示详情按钮上的文案
      buydata:{'id':'0','coinname':'USDT','buyval':'','enddateincome':'','userremain':'','limitremain':''},
/*       showmore:false,//详情是否展示
      canturn:false,
      startY:0,
      endY:0, */
    };
  },
  mounted(){
      document.querySelector('.firstlev').style.display='none'
  },
  beforeMount(){
      let bid=this.$route.query.borrowCryptoId
      let that=this
    this.$axios.get('/trade/borrow/detail', {params:{'borrowId':this.$route.query.id}})
    .then(result =>{
    switch (Number(result.code)) {
        case 2000:
        {
            this.$data.hoverItem=result.data;
          this.$data.hoverItem.canmin=this.computedlimit(result.data.borrowCryptoCode,true)
          this.$data.hoverItem.remaincanbuy=this.LEND.s(Number(this.$data.hoverItem.borrowAmount),Number(this.$data.hoverItem.boughtAmount))//剩余可投资总量
          this.$data.buydata.limitremain=this.computedlimit(result.data.borrowCryptoCode,false);
          let bid=this.$route.query.borrowCryptoId
          if(this.hoverItem.borrowTypeId==1){this.computeval()}
       if(this.LEND.localStorage('haslogin')&&(this.LEND.localStorage('haslogin')=='true')){
                    this.$axios.get('/trade/asset/amount', {params:{'cryptoId':bid}})
                    .then((res2) =>{
                                    switch (Number(res2.code)) {
                                        case 2000:
                                          let newdata={'userremain':res2.data.amount,'limitremain':res2.data.lastNewAmount};
                                          this.$data.buydata=Object.assign(this.$data.buydata,newdata)
                                        break;
                                        default:
                                          this.$toast(res2.message.toString());
                                    }
                    }) 
       }
        // that.$data.log_module.push(1); 
            //获取该币种拥有量和可用新手额度
            break;
        }
        default:
        {
            this.$toast(result.message.toString());
        }
    }})
            //详情里预告标显示倒计时时间
        interval=setInterval(()=>{
          if(!!this.hoverItem.createTime){
            let a=this.hoverItem.startTime||''
            this.$data.show_timetext= (new Date().getTime().toString().substr(0,10)>this.hoverItem.startTime)?'Interest':this.parsetime_format(a)+'later '
          }else{
            this.$data.show_timetext='Interest'
          }
        },1000)
  },
  computed: {
      ...mapState({module:'module'}), 
  },
  methods: {
          computeval:async function(){
                let nowprice= await this.getPriceFun(this.hoverItem.mortgageCryptoId,this.hoverItem.borrowCryptoId)
               this.shijia=this.LEND.fixFloat(Number(this.hoverItem.mortgageAmount)*nowprice);
            // return this.shijia
      },
    fixFloat:function(val){
      if(!val){
        return '';
      }else{
         return this.LEND.fixFloat(val)
      }
    },
      haspersent(a,b){
        return this.LEND.m(Number(a),Number(b))
      },
      timeTolocal(v){
        let val=v||''
        return this.LEND.timeToLocal(val).toString().indexOf('NaN')>-1?'loadding...':this.LEND.timeToLocal(val)
      },
      checkTime(i) {  //处理小于10的时间字段
          if (i < 10) {
            i = "0" + i;
          }
          return i;
      },
      parsetime_format(a){              
        var awaittime=a-new Date().getTime().toString().substr(0,10)
        var days=Math.floor(awaittime/(24*3600))
        var leave1=awaittime%(24*3600)    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600))
        //计算相差分钟数
        var leave2=leave1%(3600)        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60))
        //计算相差秒数
         //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave2%(60)   )
        days=this.checkTime(days)
        hours=this.checkTime(hours)
        minutes=this.checkTime(minutes)
        seconds=this.checkTime(seconds)
        return  (days+"days  "+hours+":"+minutes+":"+seconds)
      },
      getboughtPercent(a,b){
        if((a==undefined)||(b==undefined)){
          return 0
        }else{
          return this.LEND.d(a,b)
        }
      },
      annualized:function(interest,days){
        //根据天数来分别发挥年化或者日利率
            return  (interest*100*360).toFixed(2).toString().indexOf('NaN')>-1?'loadding...': (interest*100*360).toFixed(2)
      },
      computedlimit(cointype,ismin){
        //ismin true不获取新手标最大投资额度 ，即要获取新手标最小投资额度
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
            return ismin?100:2000
          break;
          default:
          break;
        }
      },
    moreinfolifun:function(s){
      this.$data.moreinfoli=s.moreinfoli
    },
    /*
    getPriceFun:async function(mn,bn){
 let symbolObj = { "BTC": 1000,"ETH": 1001,"GXS": 1002,"QKC": 1003},symbol1 = '',symbol2 = '',flag = '',price = 0,gerArr = [];;
            if(mn!="USDT"){ //当抵押币种不是USDT需请求
                flag = false;
                symbol1 = symbolObj[mn];
                if(bn!="USDT"){   //当借入币种不是USDT需请求
                    symbol2 = symbolObj[bn];
                }
            }else{  //当抵押币种是USDT则需要比率需要求反  flag作为求反的标识符
                flag = true;
                symbol2 = symbolObj[bn];
            }
            (symbol1)&&gerArr.push(this.$axios.get(`${this.Posturl}/price/latest?symbol=${symbol1}`)); 
            (symbol2)&&gerArr.push(this.$axios.get(`${this.Posturl}/price/latest?symbol=${symbol2}`)); 
                    if(gerArr.length == 1){
                      gerArr[0].then((res)=>{   //单个请求完成时
                      (res.code=='ok')?((flag)? (price = 1/res.data.price):(price = res.data.price)):this.$toast(res.message);  
                                         this.$data.nowPrice=price
                      })
                        return (this.$data.nowPrice)
                  }else{
                      let that = this;
                      this.$axios.all(gerArr).then(this.$axios.spread(function (acct, perms) { //两个请求现在都执行完成
                      (acct.code=='ok' && perms.code=='ok')?( price= acct.data.price/perms.data.price): that.$toast(acct.message || perms.message);
                      that.$data.nowPrice=price
                     })
                      );   
                        return (this.$data.nowPrice)
                  }  
    },*/
    getPriceFun:async function(mid,bid){//抵押币种id,借入币种id
                let that = this,price;
                const result=new Promise((resolve,reject) => {
                  this.$axios.get(`/trade/crypto/price?mortgageCryptoId=${mid}&borrowCryptoId=${bid}`).then(res=>{
                      switch(Number(res.code)){
                          case 2000:
                          price=res.data.price;
                          that.$data.nowPrice=res.data.price;
                          resolve(Number(price)) ;
                          break;
                          default:
                          this.$toast(res.message)
                          break;
                      }
                  }).catch(err=>{
                      
                  });  
              })
              return result
        },
      backhistory:function(){
         document.querySelector('#Investment>.Investment').style.display='block'
        this.$router.go(-1)
      },
      gobuy(){ //非法白名单
        if(
          (typeof this.LEND.localStorage('haslogin')=='undefined')||(this.LEND.localStorage('haslogin')=="false")){
           this.$router.push({ path:(this.$store.state.blockchain==0)?'/UserCenterNoBind':'/Login'})
           return false;
        }
        if(
          (Number(this.LEND.localStorage('igoogle')) != 1)||( Number(this.LEND.localStorage('iphone')) != 1)){
             this.$MessageBox.alert('Please go to [me]-[Security Center] for certification before you can invest',{title:'Tip',confirmButtonText:'Confirm'}).then(()=>{
               this.$router.push({ name:'Safe',query:{redirect:this.$route.fullPath}})
            })
            return false;
        }
        if(
          this.LEND.localStorage('nickname')==undefined||this.LEND.localStorage('nickname')==''){
           this.$MessageBox.alert('After setting the nickname, you can invest, is it going to set?',{title:'Tip',confirmButtonText:'Confirm'}).then(()=>{
               this.$router.push({ path:'/UserCenterSetting'})
            })
            return false;
        }
        if(this.$store.state.blockchain!=0){
           let bid=this.$route.query.borrowCryptoId
          this.$axios.get('/trade/asset/amount', {params:{'cryptoId':bid}})
          .then((res2) =>{
                          switch (Number(res2.code)) {
                              case 2000:
                                let newdata={'userremain':res2.data.amount,'limitremain':res2.data.lastNewAmount};
                                this.$data.buydata=Object.assign(this.$data.buydata,newdata)
                              break;
                              default:
                                this.$toast(res2.message.toString());
                          }
          })
          .catch((err)=>{
              this.$toast('haserror'+err)
          })
        }else{
           this.$router.push({ path:(this.$store.state.blockchain==0)?'/UserCenterNoBind':'/Login'})
           return false;
        }
         


         let newdata={'id':this.hoverItem.id,'coinname':this.hoverItem.borrowCryptoCode,'buyval':'','enddateincome':'0'};
          this.$data.buydata=Object.assign(this.$data.buydata,newdata)
        this.$data.alertmodule=1
     },
     cancelalert(){
        this.$data.alertmodule=0;
     },
      gopay(val,income){    
        if(((Number(val)>this.$data.buydata.limitremain))&&(Number(this.hoverItem.borrowTypeId)>=4)){
          this.$toast('New user ! Your currency qouta is less than '+val+',please enter again')
          return
        }
          if(Number(this.$data.buydata.userremain)>=Number(val)){
            this.$data.alertmodule=3;
          }else{
            this.$data.alertmodule=2;
          }
            this.$set(this.$data.buydata,'buyval',val)
            this.$set(this.$data.buydata,'enddateincome',income)
      },
      confirmpay(gcode){
        if(busy_axios){return false}
        busy_axios=true
         let mygcode=gcode
          this.$axios.post('/trade/invest/create', {'access_token':this.LEND.localStorage('access_token'),'borrowId': this.hoverItem.id,'amount': this.buydata.buyval, 'googleCode': mygcode }).then((result) =>{
              busy_axios=false
            switch (Number(result.code)) {
                  case 2000:
                  {
                      this.$toast('success,you can see another invests');
                      this.$data.alertmodule=0;
                      this.$router.push({name:'Investment'})
                      this.hoverItem={}
                     
                  }
                    break;
                  case -1:
                    this.$toast(result.message)
                    break;
                  case 1004:
                    this.$MessageBox.alert('After setting the nickname, you can invest, is it going to set?',{title:'Tip',confirmButtonText:'Confirm'}).then(()=>{
                      this.$router.push({ path:'/UserCenterSetting'})
                    })
                    break;  
                  default:
                  {
                  }
              }
             
          })

      },
      gorecharge(shouldbuy){
        this.$data.alertmodule=0;
        this.$router.push({ path:'/Wallet'})
      }
      
    },
  components:{
    'inputponent':inputponent,
    'payponent':payponent
  },
  destroyed(){
    clearInterval(interval)
    interval=null
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import '../../assets/css/mixin.scss'
@import "./Investment.scss"

</style>
<style>
.iteminfos #refreshContainer .incrise .pg_item .lineout{width:8rem;}
</style>

