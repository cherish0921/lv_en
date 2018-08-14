<template>
    <div id="user">
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../static/images/icon/pic_navb.png" alt="" @touchend="cancelalert"> 
                <p>About Us</p>
            </div>  
        </div>
        <div class="common">
            <div class="clearfloat" @touchend="aboutLend">
                <span>What is Lendchain?</span><img src="../../../static/images/icon/arrow2.png" alt="What is Lendchain?" srcset="">
            </div>
            <div class="clearfloat"><span>Current version</span><span style="font-size:16px;">v1.0</span></div>
        </div>
        <div class="common">
            <div class="clearfloat"><span>Website</span><span><a href="https://www.lendchain.io" target="_blank">www.lendchain.io</a></span></div>
            <div class="clearfloat"><span>Wechat Official Account </span><span style="color:#509FFF;">Lend Chain</span></div>
            <div class="clearfloat"><span>GeekPark</span><span><a href="https://weibo.com/lendchain" target="_blank">weibo.com/lendchain</a></span></div>
            <div class="clearfloat"><span>Twitter</span><span><a href="https://twitter.com/lendchain" target="_blank">twitter.com/lendchain</a></span></div>
            <div class="clearfloat"><span>Telegram</span><span><a href="https://t.me/LendChainEnglish" target="_blank">t.me/LendChainEnglish</a></span></div>
            <div class="clearfloat"><span>Facebook</span><span><a href="https://facebook.com/lendchain" target="_blank">facebook.com/lendchain</a></span></div>
            <div class="clearfloat"><span>Instagram</span><span><a href="https://instagram.com/lendchain" target="_blank">instagram.com/lendchain</a></span></div>
        </div>
        <div class="about-lend" v-if="aboutLendState">
            <div class="header_pl">
                <div class="headerline">
                    <img src="../../../static/images/icon/pic_navb.png" @touchend="cancel()" alt="返回"> 
                    <p>What is Lendchain?</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>Team</h4>
                <p class="ptitle">LendChain is an entrepreneurial team of experienced and high-competent talents. Its founder is the former CMO of GXChain. LendChain witnessed the rapid and fluctuating development of blockchain and bitcoin, accumulated rich experience, and had profound thinking and unique views on blockchain and digital assets. Team members are young, energetic, innovative and open to the challenges. With good sense of social responsibility, LendChain aims to make contribute to blockchain development.</p>
                 <h4>Project</h4>
                <p class="ptitle">LendChain is a decentralized financial service platform which provides financing, investment, insurance and other financial services for digital assets holders. For financing, LendChain provides mortgage and credit loans which support BTC, ETH, EOS, GXS and other popular cryptocurrency. For investment, LendChain has a professional investment and research team, providing diversified products such as mortgage, credit, quantitative fund, private equity fund, mine project and market maker. </p>
                 <h4>Advantage</h4>
                 <h3>Effictive & Safe</h3>
                <p class="ptitle">The highlight is to build the entire lending process on blockchain. Through smart contract to provide mortgage management, post-loan monitoring, credit assessment and other services. The whole process is completely automated without manual auditing and other manual links.</p>
                 <h3>Professional</h3>
                <p class="ptitle">LendChain is experienced in ITFIN and has a better understanding of core business. Due to business attributes and needs, LendChain built strategic partnership with GXChain, one of few successful landing projects. GXChain developed decentralized data marketplace and helped users taking full control of massive data. Once LendChain launched, a deep and imaginative cooperation will be conducted which includes but not limited to the opening of user credit information data and community cooperation. Deployed in Blockcity can rapidly bring a large number of loyal users and lay a solid foundation.</p>
                <h3>Strategic Cooperation</h3>
                <p class="ptitle">Relying on GXChain ecosystem, in terms of credit assessment business, user can impower LendChain to access their data from GXChain. LendChain assesses credit rating and loan limit based on analysis model. In terms of operation and promotion, taking advantage of Blockcity, LendChain is able to provide efficient and convenient borrowing and financial management services.</p>
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            act: "",
            aboutLendState: false //是否显示关于我们
        };
    },
    methods: {
        cancelalert() {
            this.$router.go(-1);
        },
        aboutLend() {
            this.aboutLendState = true;
        },
        cancel(){
            this.aboutLendState = false; 
        }
    }
}
</script>
<style scoped>
.about-lend{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    z-index: 1000;
}
.risk-manage{
    font-size: 12px;
    padding: .5rem .4rem;
    margin-top: 10px;
    background-color: #fff;
}
/*.risk-manage p.ptitle{
    margin-top: 10px;
}l*/
.risk-manage p{
    line-height: 18px;
    text-align: left;
}
.risk-manage h4{
    font-size: 18px;
    margin-top: 1rem;
    font-weight: 400;
    color: #262626;
}
.risk-manage h3{
    line-height: 36px;
}


#user .common>div span:last-child a{
    font-size: 14px;
    color: #509FFF;
}
#user{position:absolute;z-index:90;height:100%;width:100%;background-color:#f5f5f5;}
.headerline{position:fixed;top:0;width:100%;border-bottom:1px solid #e6e6e6; height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;text-align:center;}
.headerline img{position:absolute;left:0;height: 1.17rem;z-index: 91;padding: 0.4rem;float: left;}
.personnal .header_pl>img{height:2.1rem;margin:0 auto;}
#user .bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;}
#user .common{margin-top:10px;text-align: right;}
#user .common:nth-child(2){margin-top:1.5rem;}
#user .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:1px solid #e5e5e5;padding-right:.4rem;font-size:16px;}
#user .common>div:last-child{border:0;}
#user .common span:first-child{float: left;margin-left:.4rem;}
#user .common img{height:.37rem;vertical-align: text-bottom;}  
#user .confirmbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
#user .nocountbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;border:1px solid #509fff;color:#509fff;}
</style>
