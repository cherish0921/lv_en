<template>
<div>
    <div class="shadebg"></div>
    <div id="popcps">
        <div class="header_pop">
            <span class="popbtn" @touchend="cancelpop">Cancel</span>
            <span>{{title}}</span>
            <span class="popbtn"  @touchend="confirmlpop">Finish</span>
        </div>
        <div class="contentpop">
        <ul class="poplist" @touchend="scrollend">
            <li></li>
            <li v-if="type!='d'" v-for="(item,index) in list" :data-i="item.crypto_id" :key="index">{{item.name||item.crypto_code||item}}</li>
            <li v-if="type=='d'" v-for="(item,index) in list" :data-i="index" :key="index">{{item}} days</li>
            <li></li>
        </ul>
        <div class="lines">&nbsp;</div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            default:0
        }
    },
props:['title','list','type'],
mounted(){
    if(this.$props.type=='d'){
        this.$data.default=this.$props.list[0]
    }else{
        this.$data.default=this.$props.list[0].crypto_id
    }
    
},
methods:{
    cancelpop:function(){
  this.$emit('cancelpop')
    },
    confirmlpop:function(){
        this.$emit('confirmpop',this.$data.default)
        this.$emit('cancelpop')
    },
    scrollend:function(e){//选择列表
        let h=document.querySelector('.poplist').scrollTop+40
        let arr=document.querySelectorAll('.poplist li')
        let neararr=[]; 
        arr.forEach(element => {neararr.push({ele:element,ot:element.offsetTop}) });
        var scrollto=neararr.sort(function(a, b) {
        return Math.abs(a.ot -h ) - Math.abs(b.ot - h);
        })[0];
        TweenLite.to(document.querySelector('.poplist'),.3,{scrollTo:scrollto.ot-40,ease:Power1.easeOut})
        this.$data.default=(this.$props.type=='d')?scrollto.ele.getAttribute('data-i'):scrollto.ele.getAttribute('data-i')
    }
}

}
</script>
<style scoped>
.shadebg{width:100%;height:100%;position: absolute;top:0;background-color:rgba(0,0,0,.6);z-index:69;}
#popcps{position: fixed; width: 100%;bottom:1.33rem; background-color:#fff;z-index:69 }
#popcps .header_pop{height:1.16rem;line-height:1.16rem;background-color:#f6f6f6;color:#000;font-size:17px;}
#popcps .header_pop span:nth-child(1){float:left;padding-left:.4rem;color:#509fff;font-size:15px; }
#popcps .header_pop span:nth-child(3){float:right;padding-right:.4rem;color:#509fff;font-size:15px;}
#popcps .contentpop{height:120px;}
#popcps .poplist{position:absolute;width:100%;height:120px;font-size:14px;overflow: auto;top:40px;z-index: 99;}
#popcps .lines{position:relative;height:40px;top:40px;border-top:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6;}
#popcps .poplist li{line-height:40px;height:40px;}
#popcps .poplist li:last-child{border:0;}
</style>
