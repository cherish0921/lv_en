<template>
<div class="shadebg">
    <transition name="lendchainfade1">
  <div class="inputponent">
     <div class="title clearfloat">
         <img @touchend="rollback" src="../../../static/images/icon/cancel_alert.png" alt="">Pay<span  ></span>
     </div>
    <div class="usercoin clearfloat">
        <div>
          Acount
        </div>
        <span>{{buyval}}</span>
     </div>
    <div class="usercoin clearfloat">
        <div>
            <p>Available balance</p>
            <p>Available balance<span>{{userremain}}</span>{{coinname}}</p>
        </div>
        <span>{{userremain}}&nbsp;{{coinname}}</span>
     </div>
    <div class="enddateincome clearfloat">
        <span>yield to maturity:</span>
        <span>{{enddateincome}}</span>
        {{coinname}}
    </div>
    <div class="confirmbtn" @touchend="confirm">Recharge</div>

  </div>
      </transition>
</div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<script>
export default {
  name:"inputponent",
  data() {
    return {
  }},
  props: ['coinname','buyval','enddateincome','userremain'],
  computed:{
      shouldrecharge:function(){
          return Math.ceil(this.buyval-this.userremain)
      }
  },
  methods:{
      rollback:function(){
      this.$emit('cancelalert');
      },
      confirm:function(){
          this.$emit('gorecharge',this.shouldrecharge)
      }
  }
}
</script>

<style scoped>
.shadebg{position: fixed;width: 100%;height:100%;top:0;left:0;right:0;z-index:100;background-color:rgba(0,0,0,.3)}
.inputponent{position: fixed;z-index: 90;bottom:0;width:100%;background-color:#fff;border-top: 1px solid #e6e6e6;}
.inputponent .title,.inputponent .usercoin,.inputponent .enddateincome{height:1.35rem;line-height:1.35rem;font-size:16px;border-bottom:1px solid #e6e6e6;}
.inputponent .title{width:100%;}
.inputponent .title img{width:.4rem;position: absolute;left:.4rem;top:.4rem;}
.inputponent .usercoin{line-height:initial;}
.inputponent .usercoin{width:100%;padding:.1rem .4rem;text-align: left;}
.inputponent .usercoin>div{    display: inline-block;}
.inputponent .usercoin>div p:last-child{font-size:12px;color:#999;}
.inputponent .usercoin>span{float:right;background: linear-gradient(to right, #ff902e, #ff6343);-webkit-background-clip:text;color: transparent;position: relative;top: .35rem;}
.inputponent .enddateincome{color:#509fff;font-size:12px;border-bottom:0;}
.enddateincome span:nth-child(1){color:#999;}
.enddateincome span:nth-child(2){margin:.1rem;}
.confirmbtn{margin:.5rem .4rem .8rem .4rem;height:1.17rem;line-height:1.17rem;border-radius:4px;color:#fff;background: linear-gradient(to right, #509fff, #4886FF); }

</style>
