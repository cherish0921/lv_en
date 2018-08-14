<template>
    <div class="toumingshade"  @touchend="canceltip">
        <div class="tip">
           <img  v-if="_status==1" src="../../../static/images/personnal/module5/true.png" alt="" srcset="">
           <img  v-if="_status==2" src="../../../static/images/personnal/module5/nofull.png" alt="" srcset="">
        </div>
    </div>
</template>
<script>

export default {
data(){
    return{
        wrongtipshow:false,
        toumingshow:false
        }
},
  props:['_status'],
  mounted(){
      document.documentElement.style.overflow = "hidden";
      var to=setTimeout(() => {
          this.canceltip()
          clearTimeout(to)
      }, 1500);
  },
  methods:{
      rollback:function(){
      this.$emit('cancelalert');
      },
      canceltip:function(){
          this.$emit('canceltip',Boolean(this.$props._status==1))
      },
      confirm(){
          if(type==='i'){
              ///如果验证码错误，
             // this.wrongtipshow=true
             //toumingshow=true
                ///如果验证码正确，
             // this.wrongtipshow=true
          }else{

          }
          this.$emit('confirm',this.gcode)
      }
  }
}
</script>

<style scoped>
.tip{text-align: center}
.toumingshade{position:fixed;width:100%;height:100%;top:0;left:0;right:0;z-index: 110;background-color: rgba(0,0,0,0.3)}
.toumingshade img{position: relative;z-index:111;top:5rem;;width:2.4rem;}
</style>