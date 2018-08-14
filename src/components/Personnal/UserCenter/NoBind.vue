<template>
<div class="gobind" >
    <p class="bindtip">Tips: If you choose not to bind, you will permanently lose the binding opportunity</p>
    <router-link :to="{path:'/BindBlockOrBuild',query:{type:1}}"><div class="confirmbtn" style="text-align: center;">Bind LendChain Account</div></router-link>
    <router-link :to="{path:'/BindBlockOrBuild',query:{type:2}}"><div class="nocountbtn" style="text-align: center;">I don't have a LendChain account</div></router-link>
</div>
</template>
<script>

export default {
    data() {
        return {
           
        }
    },
    updated() {
    },
    components: {
    },
    methods: {
    }
}
</script>
<style scoped>
p{
    text-align: center;
}
#user{position:absolute;z-index:90;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;}.header_pl{padding-bottom:.4rem;color:#fff; background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));text-align:center;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
.header_pl>img{height:2.1rem;margin:0 auto;}
#user .bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;}
#user .common{margin-top:10px;text-align: right;}
#user .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:1px solid #e5e5e5;padding-right:.4rem;}
#user .common span:first-child{float: left;margin-left:.4rem;}
#user .common img{height:.37rem;vertical-align: text-bottom;transform: rotate(-90deg);}  
#user .confirmbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
#user .nocountbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;border:1px solid #509fff;color:#509fff;}
</style>
