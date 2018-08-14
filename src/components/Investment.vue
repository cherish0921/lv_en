<template>
  <div id="Investment">
     <router-view/>
<!--    @touchstart="movestart" @touchmove="moving" @touchend="moveend" -->
  <div class="Investment firstlev">
    <div class="mainhead">
    <div class="title">
      Invest
    </div>
    <ul class="header-list">
      <li :class="{nowpage:(limodule==1)}" @touchend="limodulefun(1)">All</li>
      <li :class="{nowpage:(limodule==2)}" @touchend="limodulefun(2)">Platform</li>
      <li :class="{nowpage:(limodule==3)}" @touchend="limodulefun(3)">Mortgage</li>
    </ul>
   </div>
   <div class="investment-list">
     <nocontent v-if="(investList.length<=0)&&(investList_f.length<=0)"></nocontent>
     <div class="item"  :class="(Number(item.status)!=0)?'itemend':''"  :borrowid="item.id"  v-for="(item) in investList" :type="item.borrowTypeId"   :key="((limodule==1?'all':limodule==2?'pingtai':'diya'))+item.id " v-tap="{methods:itemfun,name:'tap',borrowCryptoId:item.borrowCryptoId,id:item.id}" >
       <div class="hd_item clearfloat">
        <span><i :class="(item.borrowTypeId!=1?'':'diya')">{{item.borrowTypeId!=1?'P':'M'}}</i>{{item.orderId}}
        <i v-if="item.borrowTypeId==1">{{item.nickname}}</i></span>
         <span>
           <img v-if="item.borrowTypeId==5" class="label" src="../../static/images/Investment/en_newbie.png" alt="" srcset="">
           <img v-if="item.borrowTypeId==4" class="label" src="../../static/images/Investment/en_newbiepre.png" alt="" srcset="">
           <img v-if="item.borrowTypeId==2" class="label" src="../../static/images/Investment/en_pre.png" alt="" srcset="">
         </span>
         </div>
       <table class="ct_item">
          <tr class="v_item">
              <td><span>{{annualized(item.interestRates,item.borrowDays)}}</span>%</td>
              <td>{{item.borrowDays}} days</td>
              <td v-if="Number(item.status)==0">{{item.borrowAmount}}&nbsp;{{item.borrowCryptoCode}}</td>
          </tr>
          <tr class="n_item">
              <td>Rate (year)</td>
              <td>Period</td>
              <td v-if="Number(item.status)==0">Borrowed</td>
          </tr>
       </table>
       <div class="pg_item" v-if="Number(item.status)==0"><span class="lineout"><i class="linein gradient_line" :style="'width:'+(getboughtPercent(item.boughtAmount,item.borrowAmount)*7.6)+'rem;'" >&nbsp;</i></span><span>{{(getboughtPercent(item.boughtAmount,item.borrowAmount)*100).toFixed(1)}}%</span></div>
     </div>
     <p v-if="investList_f.length>0" style="margin-top:.6rem;color:#999;" @touchend="fullshowtoggle">{{(limodule==1)?'See the recent full':((limodule==2)?'See the recent full standard':'See the recent full standard platform')}}&nbsp;&nbsp;<img v-if="!fullshow" src="../../static/images/icon/arrow.png" alt="" srcset=""></p>
     <div v-if="fullshow" class="item"  :class="(Number(item.status)!=0)?'itemend':''"  :borrowid="item.id"  v-for="item in investList_f" :type="item.borrowTypeId"  :key="((limodule==1?'all':limodule==2?'pingtai':'diya'))+item.id" v-tap="{methods:itemfun,name:'tap',borrowCryptoId:item.borrowCryptoId,id:item.id}">
       <div class="hd_item clearfloat">
        <span><i :class="(item.borrowTypeId!=1?'':'diya')">{{item.borrowTypeId!=1?'P':'M'}}</i>{{item.orderId}}
        <i v-if="item.borrowTypeId==1">{{item.nickname}}</i></span>
         <span>
            <img v-if="item.borrowTypeId==5" class="label" src="../../static/images/Investment/en_newbie.png" alt="" srcset="">
            <img v-if="item.borrowTypeId==4" class="label" src="../../static/images/Investment/en_newbiepre.png" alt="" srcset="">
            <img v-if="item.borrowTypeId==2" class="label" src="../../static/images/Investment/en_pre.png" alt="" srcset="">
         </span>
         </div>
       <table class="ct_item">
          <tr class="v_item">
              <td><span>{{annualized(item.interestRates,item.borrowDays)}}</span>%</td>
              <td>{{item.borrowDays}} days</td>
              <td v-if="Number(item.status)==0">{{item.boughtAmount}}&nbsp;{{item.borrowCryptoCode}}</td>
          </tr>
          <tr class="n_item">
              <td>Rate (year)</td>
              <td>Period</td>
              <td v-if="Number(item.status)==0">Borrowed</td>
          </tr>
       </table>
       <div class="pg_item" v-if="Number(item.status)==0"><span class="lineout"><i class="linein gradient_line" :style="'width:'+(getboughtPercent(item.boughtAmount,item.borrowAmount)*7.6)+'rem;'" >&nbsp;</i></span><span>{{(getboughtPercent(item.boughtAmount,item.borrowAmount)*100).toFixed(1)}}%</span></div>
     </div>
   </div>
  </div>

  </div>
</template>

<script>
import { mapState,mapGetters,mapActions} from 'vuex'
import nocontent from './Investment/nocontent'
//import gauthponent from './common/gauthcontent.vue'
let interval
export default {
  name: "Investment",
  components:{
    'nocontent':nocontent
  },
  data() {
    return {
      busy:false,//是否在发起ajax请求 
      limodule:1,
      investList_a_f:[],//全部满标标
      investList_p_f:[],//满标平台标
      investList_m_f:[],//满标抵押标
      investList_a:[],//全部未满标标
      investList_p:[],//未满标平台标
      investList_m:[],//未满标抵押标
      fullshow:false,//满标是否显示
      nowpage_all:1,//全部标已加载了多少页
      nowpage_p:1,//平台标已加载了多少页
      nowpage_m:1,//抵押标已加载了多少
    };
  },
  beforeUpdate(){
    document.querySelector('.firstlev').style.display=(window.location.href.indexOf('Investmentinfo')>0)?"none":"block"
  },
mounted(){
  this.changeState({type:'isloading',value:true})
 var _self = this;
 this.changeState({type:'isloading',value:true})
  this.getmoredata()
//  let dom=document.querySelectorAll('.investment-list')[0]
  // function fnn(e) {
  //           if (window.scrollY >=dom.scrollHeight- window.screen.availHeight - 40) {
  //               if (!_self.busy) {
  //                   _self.busy = true;
  //                   _self.getmoredata();
  //               }
  //           }
  //       }
  if(this.$route.name=='Investment'){
    document.removeEventListener("scroll",_self.fnn)
    document.addEventListener("scroll",_self.fnn);
  }else{
    document.removeEventListener("scroll",_self.fnn)
  }
},
  computed: {
    //  ...mapState({module:'module'}), 
      investList_f:function(){
        return  (this.$data.limodule==1)?this.$data.investList_a_f:((this.$data.limodule==2)?this.$data.investList_p_f:this.$data.investList_m_f)
      },
      investList:function(){
         return (this.$data.limodule==1)?this.$data.investList_a:((this.$data.limodule==2)?this.$data.investList_p:this.$data.investList_m)
      }
  },
  methods: {
    annualized:function(interest,days){
      //根据天数来分别发挥年化或者日利率
         
         return (interest*100*360).toFixed(2)
    },
    fixFloat:function(val){
        return this.LEND.fixFloat(val)
    },
      getboughtPercent(a,b){
        return this.LEND.d(a,b)
      },
    getmoredata:function(){
       let investlistArr=[[this.$data.investList_a,this.$data.investList_a_f],
                           [this.$data.investList_p,this.$data.investList_p_f],
                           [this.$data.investList_m,this.$data.investList_m_f]]
        let nowpageArr=[,this.nowpage_all,this.nowpage_p,this.nowpage_m];
        if(nowpageArr[this.limodule]==-1){
          return false
        }
        if(((this.limodule==1)&&(this.nowpage_all==-1))||((this.limodule==3)&&(this.nowpage_m==-1))||((this.limodule==2)&&(this.nowpage_p==-1))){
          return false
        }

      //  setTimeout(()=>{
  this.$axios.get("/trade/invest/mobile/index", {
                    params: {
                        page: nowpageArr[this.limodule],
                        page_size: 10,
                        type: this.$data.limodule - 1
                    }
                }).then(result1 => {
                    switch (Number(result1.code)) {
                        case 2000:
                            switch (this.limodule) {
                                case 1:
                                    this.nowpage_all = (result1.data.length >= 10) ? (this.nowpage_all + 1) : -1;
                                    break;
                                case 2:
                                    this.nowpage_p = (result1.data.length >= 10) ? (this.nowpage_p + 1) : -1;
                                    console.log(this.nowpage_p);
                                    break;
                                case 3:
                                    this.nowpage_m = (result1.data.length >= 10) ? (this.nowpage_m + 1) : -1;
                                    break;
                                default:
                                    break;
                            }
                            result1.data.forEach(element => {
                                let secondi = (Number(element.status) == 0) ? 0 : 1
                                let tarArr = investlistArr[this.$data.limodule - 1][secondi]
                                let inclue = false;
                                for (let p = 0, lp = tarArr.length; p < lp; p++) {
                                    if (element.id == tarArr[p].id) {
                                        inclue = true
                                    }
                                }
                                if (inclue == false) {
                                    tarArr.push(element)
                                }

                            });
                            break;
                        default:
                            this.$toast(result1.message.toString())
                            break
                    }
                    this.changeState({type:'isloading',value:false})
                    this.busy = false;
                })
       // },200)
    },
    limodulefun:function(i){
       if(this.$data.limodule!=i){
        this.nowpage_all = 1;
        this.nowpage_p = 1;
        this.nowpage_m = 1;
        this.$data.limodule=i
        this.$data.fullshow=false
        this.investList_a_f = [],//全部满标标
        this.investList_p_f = [],//满标平台标
        this.investList_m_f= [],//满标抵押标
        this.investList_a= [],//全部未满标标
        this.investList_p= [],//未满标平台标
        this.investList_m= [],//未满标抵押标
        window.scrollTo(0,0);
        this.getmoredata();
        }
    },
    fullshowtoggle:function(){
      this.$data.fullshow=true
    },
    itemfun:function(s){
        this.$router.push({ name:'Investmentinfo', query:{id:s.id,borrowCryptoId:s.borrowCryptoId}})
      },
      fnn(e) {
        let _self=this
        let dom=document.querySelectorAll('.investment-list')[0]
        if(this.$route.name=='Investment'){
          if (window.scrollY >=dom.scrollHeight- window.screen.availHeight - 40) {
            if (!_self.busy) {
                _self.busy = true;
                _self.getmoredata();
            }
          }
        }
    },
      ...mapActions(['changeState'])
    },
    destroyed(){
        document.removeEventListener("scroll",this.fnn)
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import '../assets/css/mixin.scss'
@import "../components/Investment/Investment.scss"
</style>