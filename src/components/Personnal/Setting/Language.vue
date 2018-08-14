<template>
    <div id="language">
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../../static/images/icon/pic_navb.png" @touchend="goBack" alt="返回"> 
                <p>Language setting</p>
            </div>  
        </div>
        <div  class="common">
            <div class="clearfloat" @touchend="toggleLang(0)">
                <span>中文</span><span v-show="nowLang==0">√</span>
            </div>
        </div>
       <div   class="common">
            <div class="clearfloat" @touchend="toggleLang(1)">
                <span>English</span><span v-show="nowLang==1">√</span>
            </div>
        </div>
        <div class="common">
            <div class="clearfloat" @touchend="toggleLang(2)">
                <span>한국어</span><span v-show="nowLang==2">√</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            nowLang:location.href.indexOf('/en/')>0?1:0
        }
    },
    methods:{
        goBack() {
           this.$router.push({path:'/Setting'});
        },
        toggleLang(val){
            if(this.nowLang==val){
                return false;
            }
            if(val==0){
                 location.href="/Language"
            }else if(val==1){
                location.href="/en/Language"
            }else{
               location.href="/ko/Language" 
            }
        }
    }
}
</script>
<style scoped>
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
#language{background-color:#f5f5f5;}
#language .common{margin-top:10px;text-align: right;}
#language .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:1px solid #e5e5e5;padding-right:.4rem;}
#language .common span:first-child{float: left;margin-left:.4rem;font-size:16px;}
#language .common span:last-child{height:.37rem;font-weight: bolder;vertical-align:text-bottom;color:#509fff;}
#language .common img{height:.37rem;vertical-align: text-bottom;transform: rotate(-90deg);}  
</style>