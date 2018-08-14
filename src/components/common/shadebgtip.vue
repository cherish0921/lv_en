<template>
    <div class="toumingshade" >
        <div class="tip">
            <p>Full authentication is required before borrowing</p>
            <span @touchend="confirm(false)">ignore</span> <span @touchend="confirm(true)">authenticate</span>
        </div>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'
export default {
data(){
    return{
        gcode:'',
        wrongtipshow:false,
        toumingshow:false
        }
},
  props:[],
  mounted(){
      document.documentElement.style.overflow = "hidden";
  },
  methods:{
      rollback:function(){
      
      },
      confirm(val){
          if(!val){
               this.$emit('hideshadebgtip')
          }else{
               //this.$store.dispatch("changeState",{type:'mainmodule',value:4});
               this.$router.push({path:'/Safe'})
               
          }
          
      }
  }
}
</script>

<style scoped>
.toumingshade{position:fixed;width:100%;height:100%;top:0;left:0;right:0;z-index: 110;background-color: rgba(0,0,0,0.3)}
.toumingshade img{position: relative;z-index:111;top:5rem;;width:2.4rem;}
.toumingshade .tip{width:7.2rem;height:3.5rem;color:#000;font-size: 16px;background-color:#fff;border-radius:16px;margin-left: 1.4rem;margin-top: 70%;}
.toumingshade .tip p{height:2.3rem;padding: .8rem .4rem;border-bottom: 1px solid #e6e6e6;}
.toumingshade .tip span{display:inline-block;width:48%;height:1.2rem;line-height: 1.2rem;color:#509fff;}
.toumingshade .tip span:last-child{border-left:1px solid #e6e6e6;}
</style>