<template>
    <div id="help__">
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../../static/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                <p>Help Center</p>
            </div>  
        </div>
        <div class="inputs">
            <div class="clearfloat" @touchend="toShowDetail(1)">
                <span>Rate Instructions</span><img src="../../../../static/images/icon/arrow.png" alt="" srcset="">
            </div> 
            <div class="clearfloat" @touchend="toShowDetail(2)">
                <span>Risk Management</span><img src="../../../../static/images/icon/arrow.png" alt="" srcset="">
            </div>            
            <div class="clearfloat" @touchend="toShowDetail(3)">
                <span>User Guide</span><img src="../../../../static/images/icon/arrow.png" alt="" srcset="">
            </div>            
            <div class="clearfloat" @touchend="toShowDetail(4)">
                <span>Mortgage Loan Instruction</span><img src="../../../../static/images/icon/arrow.png" alt="" srcset="">
            </div>            
            <div class="clearfloat" @touchend="toShowDetail(5)">
                <span>Application Scenario</span><img src="../../../../static/images/icon/arrow.png" alt="" srcset="">
            </div>            
        </div>
        <Helpdetail :selected="selected"  v-if="selected" @cancelalert="hideinfo"></Helpdetail>
    </div>
</template>
<script>
import Helpdetail from '@/components/Personnal/Help/Helpdetail'

export default {
    data() {
        return {
            selected:0  //默认为0不选择
        }
    },
    components:{
        Helpdetail    
    },
    methods: {
        cancelalert(){
         this.$router.push({name:'Personnal'})
        },
        toShowDetail(num){
            this.selected = num;    
        },
        hideinfo:function(){
            this.selected = 0;
        }
    }
}
</script>
<style scoped>
.headerline{position: fixed;width: 100%;top: 0;z-index: 1000;border-bottom: 1px solid #e6e6e6; height:1.17rem;line-height:1.17rem;font-size:16px;background-color:#fff;margin-bottom:10px;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;float:left;}
#help__ {
  position: absolute;
  text-align:center;
  z-index: 90;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
#help__ >img:first-child {
  position:absolute;
  z-index:91;
  height:.45rem;
  left:.4rem;
  top:.4rem;
}
#help__ > .logobg {
  width: 100%;
}
.centername {
  margin-bottom: .4rem;
  padding:.4rem;
  background-color:#fff;
}
.centername span {
  font-size: 20px;
  padding-bottom: 0.2rem;
}
.inputs{
    margin-top:1.3rem;
    text-align: right;
}
.clearfloat{
    height: 1.33rem;
    line-height: 1.33rem;
    background-color: #fff;
    padding-right: .4rem;
}
.clearfloat span{
    font-size: 16px;
    float: left;
    margin-left: .4rem;
}
.clearfloat img{
    height: .37rem;
    vertical-align: text-bottom;
    transform: rotate(-90deg);
}
</style>
