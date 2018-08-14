<template>
    <div class="tokensale">
        <div class="goback">
            <img src="../../../static/images/icon/pic_nav.png" 
            @touchend="goBack" alt="后退" class="img-response"/>
        </div>
        <div class="tokensaletit tokensaletitpd">
            <img src="https://s.lendx.vip/static/en/images/tokensale/tokenSaletitle.png" alt="Token Sale" class="img-response"/>
        </div>
        <div class="tokensaletit">
            <div class="subtit" v-if="activityinfo.status==0">Begin in</div>
            <div class="subtit" v-else-if="activityinfo.status==1">Remaining time of the activity</div>
            <div class="subtit" v-else-if="activityinfo.status==2">End in</div>
        </div>
        <!-- 倒计时 -->
        <div class="Countdown">
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.d"></div>
                <div class="Countdown-desc">Days</div>
            </div>
            <div class="Countdown-icon">
                <span></span>
                <span></span>
            </div>
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.h"></div>
                <div class="Countdown-desc">Hours</div>
            </div>
            <div class="Countdown-icon">
                <span></span>
                <span></span>
            </div>
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.m"></div>
                <div class="Countdown-desc">Mins</div>
            </div>
            <div class="Countdown-icon">
                <span></span>
                <span></span>
            </div>
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter"  v-html="activityinfo.timertxt.s"></div>
                <div class="Countdown-desc">Secs</div>
            </div>
        </div>
        <!-- 滚动播放认购进度 -->
        <div class="swiper-box" @touchmove.prevent v-if="activityinfo.status==1||activityinfo.status==2">
            <div class="swiper-container">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(item, index) in buytoken" :key="index">
                        <div class="mtswiper-item">
                                <div class="mtswiper-buyuser">
                                    <!-- <span class="mtswiper-buyusertit">User:</span> -->
                                    <span class="mtswiper-ubyusername" v-html="item.email"></span>
                                </div>
                                <div class="mtswiper-investing">
                                    <span class="mtswiper-buyusertit">Invested:</span>
                                    <span class="mtswiper-buynum" v-html="item.amount"></span>
                                    <span class="mtswiper-buycoin" v-html="item.cryptoCode"></span>
                                </div>
                            </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <!-- token购买详情楼层 -->
        <div class="token-body"  v-if="activityinfo.status==1||activityinfo.status==2">
            <div class="token-container">
                <div class="token-head">
                    <div class="token-title">
                        <span>You can invest in ETH and QKC</span>
                        <i></i>
                    </div>
                </div>
                <!-- 我的ICO记录 -->
                <div class="myicoinvestment-record" v-if="LEND.localStorage('haslogin')=='true'">
                    <div class="myico-btn" @touchend="showinvestment">investment record</div>
                </div>
                <template v-if="iconborrowlist.length">
                    <div class="token-box" v-for="(item, index) in iconborrowlist" :key="item.id">
                        <div class="tokensale-head">
                            <div class="tokensale-coin" v-html="item.cryptoCode"></div>
                            <div class="tokensale-normel">
                                <span class="normal-title">Raised：</span>
                                <span class="normal-num" v-html="item.availamount"></span>
                                <span class="normal-coin" v-html="item.cryptoCode"></span>
                            </div>
                        </div>
                        <div class="tokensale-boby">
                            <div class="tokensale-clinch" :style="{ width: item.process}">
                                <span class="tokensale-progress progressstyle0"></span>
                                <span class="tokensale-progressnum" v-html="item.process" 
                                v-if="item.processresult>0"></span>
                            </div>
                        </div>
                        <div class="tokensale-fotter">
                            <div class="tokensale-btngroup">
                                <button class="progressstyle0" @touchend="goInvest(item)">Invest now</button>
                                <div class="tokensale-shadow progressstyle0"></div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- 活动描述 -->
        <div class="activity-desc">
            <div class="activity-content">
                <div class="activity-title">Introduction</div>
                <h4>Token Sale total: 100 million LVCOIN</h4>
                <h4>Duration: 3 days</h4>
                <h4>Soft cap: 1000ETH</h4>
                <h4>Hard cap: 5000ETH</h4>
                <div class="activity-headtit">Distribution method:</div>
                <div class="activity-descttxt">
                    <div class="activity-num">1</div>
                    <div class="activity-txt">First formula - first 1000 ETH = ETH number of your investment / ETH number of total investment * 90 million + ETH number of your investment / 1000 * 5 million; (ie take out 5 million LVCOIN extra reward for early investors users )</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-num">2</div>
                    <div class="activity-txt">Second formula - 1001 to 2000 ETH = ETH number of your investment / ETH number of total investment * 90 million + ETH number of your investment / 1000 * 3 million.</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-num">3</div>
                    <div class="activity-txt">Third formula - 2001 to 3000 ETH = ETH number of your investment / ETH number of total investment * 90 million + ETH number of your investment / 1000 * 2 million</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-num">4</div>
                    <div class="activity-txt">Forth formula - More than 3000 ETH = ETH number of your investment / ETH of total investment * 90 million</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-num">5</div>
                    <div class="activity-txt">Currency implementation : 80% ETH, 20% QKC, QKC investment will be converted into ETH, sharing early investors quota.</div>
                </div>
            </div>
        </div>
        <!-- 活动描述2 -->
        <div class="activity-desc">
            <div class="activity-content">
                <div class="activity-title">Precautions</div>
                <div class="activity-descttxt">
                    <div class="activity-txt">1. The activity is only available to users who have successfully verified of KYC.</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-txt">2. It is recommended to recharge before the start of the event to avoid the peak period.</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-txt">3. The user's first investment shall be no less than 2 ETH or equivalent QKC.</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-txt">4. Users can only invest in integer token.</div>
                </div>
                <div class="activity-descttxt">
                    <div class="activity-txt">5.A user is allowed to invest 2-20 ETH or equivalent QKC.</div>
                </div>
            </div>
        </div>
        <!-- 弹出输入软件盘 -->
        <TokenSaleinput :show="Saleinputopt.show" :type="Saleinputopt.type" 
        :coin="Saleinputopt.coin" :placeholder="Saleinputopt.placeholder" 
        :title="Saleinputopt.title" :maxiptnum="Saleinputopt.maxiptnum"
        :miniptnum="Saleinputopt.miniptnum" :isdecimal="Saleinputopt.isdecimal" 
        :disabledbtn="Saleinputopt.disabledbtn"
        @cancelalert="assignSaleinputopt" @gopay="gopay"/>
        <!-- 我的私募详情 -->
        <div class="myicon-recording" v-show="userico.showrecords" ref="myiconrecording">
            <div class="recording-container">
                <div class="recording-head">
                    <div></div>
                    <div class="recording-tit">Investment record</div>
                    <div class="recording-close" @touchend="closemyicondialog"><img src="../../../static/images/icon/cancel_alert.png" class="img-response"/></div>
                </div>
                <div class="recording-body">
                    <div class="recording-item">
                        <div class="recording-content">
                            <div class="recording-token">
                                <span class="recording-tokentit">Total investment:</span>
                                <span class="recording-tokenname">
                                    <span class="recording-totalnuum" v-html="userico.ETH.Amount"></span>
                                    <span class="recording-totalcoin">ETH</span>
                                </span>
                            </div>
                            <div class="recording-token">
                                <span class="recording-tokentit"></span>
                                <span class="recording-tokenname">
                                    <span class="recording-totalnuum" v-html="userico.QKC.Amount"></span>
                                    <span class="recording-totalcoin">QKC</span>
                                </span>
                            </div>
                            <div class="recording-token">
                                <span class="recording-tokentit"></span>
                                <span class="recording-tokenname">
                                    <span class="recording-totalnuum">≈</span>
                                    <span class="recording-totalnuum" v-html="ethtotal"></span>
                                    <span class="recording-totalcoin">ETH</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <template v-if="userico.records.length">
                        <div class="recording-item" v-for="(item, index) in userico.records" :key="index">
                            <div class="recording-num" v-html="index+1"></div>
                            <div class="recording-content">
                                <div class="recording-time" v-html="filterdatetime(item.ctime)"></div>
                                <div class="recording-token">
                                    <span class="recording-tokentit">Token:</span>
                                    <span class="recording-tokenname" v-html="item.cryptoCode"></span>
                                </div>
                                <div class="recording-token">
                                    <span class="recording-tokentit">Amount of investment:</span>
                                    <span class="recording-tokenname" v-html="item.amount"></span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import TokenSaleinput from "./TokenSaleinput";
export default {
    name: "tokensale",
    data() {
        return {
            activityinfo: {   //活动信息
                readyday: null,//new Date("2018", "6", "23", "12", "00", "00"), //准备时间
                nowtime:  null,//new Date("2018", "6", "24", "14", "08", "00").getTime(), //当前时间
                starttime: null,//new Date("2018", "6", "24", "14", "16", "40").getTime(), //开始时间
                endtime: null,//new Date("2018", "6", "24", "14", "17", "00").getTime(), //结束时间
                status: 0, //活动状态 0 预热 1 活动中 2结束
                timer:null , //计时器ID
                timertxt:{ //倒计时天，时，分，秒
                    d:'',
                    h:'',
                    m:'',
                    s:''
                }
            },
            buytoken: [], //已购买token轮播
            iconborrowlist:[], //ICO投资列表标
            userico:{ //用户ICO投资详情
                QKC:{
                    Amount:0, //已投QKC数量
                    userlastcoinnum:0, //用户剩余该币种可投数量
                    userAvailAmount:0, //用户持有该币种余额
                    placeholder:null, //提示文字
                    min:2, //最小投资额
                    max:20, //最大投资额
                    scale:6000 //比例
                },
                ETH:{
                    Amount:0, //已投ETH数量
                    userlastcoinnum:0, //用户剩余该币种可投数量
                    userAvailAmount:0, //用户持有该币种余额
                    placeholder:null, //提示文字
                    min:2, //最小投资额
                    max:20, //最大投资额
                    scale:1 //比例
                },
                ico:{ 
                    borrowId:null , //标的ID
                    googleCode:null , //谷歌验证码
                    amount:null //投资数量
                },
                showrecords:false,
                records:[] //我的投资记录
            },
            Saleinputopt:{ //软键盘配置项
                show:false,// 是否展示软键盘
                type:0, //第一步认购
                coin:null, //认购币种
                placeholder:null, //辅助输入框提示性文字
                title:null, //键盘title
                maxiptnum:null, //最大输入金额
                miniptnum:null, //最小输入金额
                isdecimal:true, //是否允许小数输入
                disabledbtn:false //是否禁用提交按钮
            },
            swiperOption: { //swiper配置项
                autoplay: true,//可选选项，自动滑动
                direction: 'vertical', //垂直播放
                simulateTouch: false, //禁止触摸
                touchMoveStopPropagation : true //阻止touchmove冒泡事件
            }
        };
    },
    created() {
        this.changeState({type:'isloading',value:true})
        this.icogettime() //请求ICO准备时间
        if(this.activityinfo.status==1||this.activityinfo.status==2){ 
            this.mergerequest() //进入后合并多个请求
        }
    },
    watch:{
        activityinfo:{
            status(val,old){ //监视活动状态
                if(val==1||val==2){
                    this.mergerequest() //进入后合并多个请求
                }
            }
        }
    },
    computed:{
        ethtotal(){
            let faillist=[undefined,false,NaN,Infinity,null,'','undefined','false','NaN','Infinity','null'],ethamount=this.userico.ETH.Amount,qkcamount=this.userico.QKC.Amount,total=0
            if(faillist.includes(ethamount)){
                ethamount=0
            }
            if(faillist.includes(qkcamount)){
                qkcamount=0
            }
            total=ethamount+qkcamount/6123
            return Math.ceil(total)
        }
    },
    methods: {
        goBack(){ //回退
            this.$router.push({path:'/'});    
        },
        startCountdown() { //开启倒计时
            let now=new Date().getTime()
            if(now<this.activityinfo.starttime){ // 活动处于准备阶段
                this.activityinfo.status=0
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.starttime)
                },1000)
            }else if(now>this.activityinfo.starttime&&now<this.activityinfo.endtime){ //活动处于进行阶段
                this.activityinfo.status=1
                this.mergerequest() //进入后合并多个请求
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.endtime)
                },1000)
            }else if(now>this.activityinfo.endtime){ //活动结束
                clearInterval(this.activityinfo.timer)
                this.activityinfo.timer=null
                this.activityinfo.status=2
                this.mergerequest() //进入后合并多个请求
                this.activityinfo.timertxt.d='00'
                this.activityinfo.timertxt.h='00'
                this.activityinfo.timertxt.m='00'
                this.activityinfo.timertxt.s='00'
            } 
        },
        leftTimer(endtime) { //计算倒计时
            let leftTime=endtime-new Date().getTime()
            let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            let hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
            let minutes = parseInt((leftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
            let seconds = parseInt((leftTime / 1000) % 60, 10); //计算剩余的秒数
            days = this.checkTime(days);
            hours = this.checkTime(hours);
            minutes = this.checkTime(minutes);
            seconds = this.checkTime(seconds);
            if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) { //开启定时器
                this.activityinfo.timertxt.d=days
                this.activityinfo.timertxt.h=hours
                this.activityinfo.timertxt.m=minutes
                this.activityinfo.timertxt.s=seconds
            }
            if (parseInt(days) <= 0 && parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) { //清除定时器
                this.activityinfo.timertxt.d='00'
                this.activityinfo.timertxt.h='00'
                this.activityinfo.timertxt.m='00'
                this.activityinfo.timertxt.s='00'
                if(this.activityinfo.status==0||this.activityinfo.status==1){ //活动处于进行阶段
                    this.startCountdown()
                }else{ //活动结束
                    clearInterval(this.activityinfo.timer)
                    this.activityinfo.timer=null
                }
            }
        },
        checkTime(i) {  //处理小于10的时间字段
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        toPercent(val){ //转成百分比
            return (Math.round(val * 10000)/100).toFixed(2) + '%';
        },
        icogettime(){ //获取请求ICO准备时间
            this.$axios.get('/trade/ico/getTime',{}).then((res) => {
                if(res.code==2000){
                    this.activityinfo.nowtime=new Date(parseInt(res.data.now)).getTime()
                    this.activityinfo.starttime=new Date(parseInt(res.data.start)).getTime()
                    this.activityinfo.endtime=new Date(parseInt(res.data.end)).getTime()
                    this.startCountdown()
                }
            })
        },
        geticoinvestlist(){ //获取滚动ICO投资列表 最近10条
            return this.$axios.get('/trade/ico/investlist',{page:1,limit:10})
        },
        geticoborrowlist(){ //获取ICO投资标
            return this.$axios.get('/trade/ico/borrowlist',{})
        },
        getuserprofile(){ //获取用户信息
            return this.$axios.get('/trade/user/profile')
        },
        getusericoinvestlist(){ //获取我的投资列表
            this.$axios.get('/trade/ico/user/investlist',{page:1,limit:100}).then((res) => {
                this.userico.records=res.data.page.records
            })
        },
        getusericobalance(){ //获取ICO投资可用余额
            return this.$axios.get('/trade/ico/user/balance',{})
        },
        mergerequest(){ //合并发送请求
            if(Boolean(this.LEND.localStorage('haslogin'))&&this.LEND.localStorage('haslogin')=='true'){ //用户已登录
                this.$axios.all([this.getuserprofile(),this.geticoinvestlist(),this.geticoborrowlist(),this.getusericobalance()]).then(this.$axios.spread( (res1,res2,res3,res4) => {
                    switch (Number(res1.code)) { //处理用户账户信息
                        case 2000:
                            {
                                this.LEND.localStorage('nickname', res1.data.nickname);
                                break;
                            }
                        default:{this.$toast(res1.message);}
                    }
                    if(res2.data.records.length){
                        this.buytoken=res2.data.records //10条滚动轮播ICO投资列表
                    }else{
                        this.buytoken=[
                            {userId: 106,email: "n*****163.com",nickname: "bmV3dWVk",cryptoId: 2,cryptoCode: "ETH",amount: 2},
                            {userId: 107,email: "10*****90@qq.com",nickname: "且行且珍惜",cryptoId: 2,cryptoCode: "QKC",amount: 12000},
                            {userId: 108,email: "21*****75@gmail.com",nickname: "Brandon",cryptoId: 2,cryptoCode: "QKC",amount: 24000},
                            {userId: 109,email: "lv*****ic@gmail.com",nickname: "Fred",cryptoId: 2,cryptoCode: "QKC",amount: 6000},
                        ]
                    }
                    if(res3.code==2000&&res3.data.length&&res4.code==2000){ //获取ICO投资标
                        res3.data.forEach((ele,index) => {
                            let percent=Number(ele.boughtAmount)/Number(ele.borrowAmount)
                            if(percent>=1){
                                this.$set(ele,'process','100%')
                            }else{
                                this.$set(ele,'process',this.toPercent(percent))
                            }
                            if(res4.data[ele.cryptoCode.toLowerCase()]){
                                this.$set(ele,'availamount',res4.data[ele.cryptoCode.toLowerCase()][`${ele.cryptoCode.toLowerCase()}LastAmount`])
                            }
                            this.$set(ele,'processresult',percent)
                        })
                        this.iconborrowlist=res3.data
                    }
                    if(res4.code==2000){ //ICO投资可用余额
                        for (let key in res4.data) {
                            if(this.userico[key.toUpperCase()]){
                                this.userico[key.toUpperCase()].Amount=res4.data[key][`${key.toLowerCase()}Amount`]
                                this.userico[key.toUpperCase()].userlastcoinnum=res4.data[key][`${key.toLowerCase()}LastAmount`]
                                this.userico[key.toUpperCase()].userAvailAmount=res4.data[key][`${key.toLowerCase()}AvailAmount`]
                                this.userico[key.toUpperCase()].min=Math.floor(res4.data[key][`${key.toLowerCase()}MinAmount`])
                                this.userico[key.toUpperCase()].max=Math.floor(res4.data[key][`${key.toLowerCase()}MaxAmount`])
                            }
                        }
                    }
                    this.changeState({type:'isloading',value:false})
                })).catch((err) => {
                    console.log(err)
                });
            }else{ //未登录
                if(this.activityinfo.status==1||this.activityinfo.status==2){
                    this.$axios.all([this.geticoinvestlist(),this.geticoborrowlist()]).then(this.$axios.spread( (res1,res2) => {
                        if(res1.data.records.length){
                            this.buytoken=res1.data.records
                        }else{
                            this.buytoken=[
                                {userId: 106,email: "n*****163.com",nickname: "bmV3dWVk",cryptoId: 2,cryptoCode: "ETH",amount: 2},
                                {userId: 107,email: "10*****90@qq.com",nickname: "且行且珍惜",cryptoId: 2,cryptoCode: "QKC",amount: 12000},
                                {userId: 108,email: "21*****75@gmail.com",nickname: "Brandon",cryptoId: 2,cryptoCode: "QKC",amount: 24000},
                                {userId: 109,email: "lv*****ic@gmail.com",nickname: "Fred",cryptoId: 2,cryptoCode: "QKC",amount: 6000},
                            ]
                        }
                        if(res2.code==2000&&res2.data.length){
                            res2.data.forEach((ele,index) => {
                                let percent=Number(ele.boughtAmount)/Number(ele.borrowAmount)
                                if(percent>=1){
                                    this.$set(ele,'process','100%')
                                }else{
                                    this.$set(ele,'process',this.toPercent(percent))
                                }
                                this.$set(ele,'processresult',percent)
                            })
                            this.iconborrowlist=res2.data
                        }
                        this.changeState({type:'isloading',value:false})
                    }));
                }
            }
        },
        goInvest(obj){ //点击参与私募认购
            if(this.activityinfo.status==0){ //活动未开始
                this.$toast('Activity has not yet started');
                return false;
            }
            if(this.activityinfo.status==2){ //活动已结束
                this.$toast('The event is over');
                return false;
            }
            if( this.LEND.localStorage('haslogin')==''||(typeof this.LEND.localStorage('haslogin')=='undefined')||(this.LEND.localStorage('haslogin')=="false") ){ //未登录
                this.$router.push({ 
                    path:(this.$store.state.blockchain==0)?'/UserCenterNoBind':'/Login',
                    query:{redirect:this.$route.fullPath}
                })
                return false;
            }
            if(
                (Number(this.LEND.localStorage('igoogle')) != 1)||
                ( Number(this.LEND.localStorage('iphone')) != 1)||
                (Number (this.LEND.localStorage('kyc') !=2))
            ){ //未谷歌验证 手机验证
                this.$MessageBox.alert('Please go to [me]-[Security Center] for certification before you can invest',{title:'Tip',confirmButtonText:'Confirm'}).then(()=>{
                    this.$router.push({ name:'Safe',query:{redirect:this.$route.fullPath}})
                })
                return false;
            }
            this.userico.ico.borrowId=obj.id
            let params={
                show:true,
                type:0,
                coin:obj.cryptoCode,
                placeholder:`Minimum input ${this.userico[obj.cryptoCode.toUpperCase()].min}`,
                title:'Invest Amount',
                maxiptnum:this.userico[obj.cryptoCode.toUpperCase()].max,
                miniptnum:this.userico[obj.cryptoCode.toUpperCase()].min,
                isdecimal:false
            }
            if(this.userico[obj.cryptoCode.toUpperCase()].Amount>0){ //非首次投注
                if(this.userico[obj.cryptoCode.toUpperCase()].userlastcoinnum==0||this.userico[obj.cryptoCode.toUpperCase()].userlastcoinnum<1){
                    params.placeholder=`Maximum input 0`
                }
            }
            this.assignSaleinputopt(params)
        },
        assignSaleinputopt(obj){ //重置软键盘配置项
            this.Saleinputopt=Object.assign(this.Saleinputopt,obj)
        },
        gopay(obj){ //确认支付
            let illegallist=[undefined,null,false,NaN,Infinity,'','undefined','null','false','NaN','Infinity']
            if(Number(obj.type)==0){ //认购阶段
                if(illegallist.includes(parseFloat(obj.amount))){ //输入非法
                    this.$toast(`please enter again`);
                    return 
                }
                if(parseFloat(obj.amount)<this.userico[obj.coin.toUpperCase()].min){ //输入数量小于最低输入量
                    this.$toast(`${obj.coin.toUpperCase()} Minimum input ${this.userico[obj.coin.toUpperCase()].min}`);
                    return
                }
                if(parseFloat(obj.amount)>this.userico[obj.coin.toUpperCase()].userlastcoinnum){ //输入数量大于剩余该币种可投数量
                    this.$toast(`${obj.coin.toUpperCase()} Maximum input ${this.userico[obj.coin.toUpperCase()].userlastcoinnum}`);
                    return
                }
                if(
                    this.userico[obj.coin.toUpperCase()].userAvailAmount<0||
                    this.userico[obj.coin.toUpperCase()].userAvailAmount<this.userico[obj.coin.toUpperCase()].min||
                    this.userico[obj.coin.toUpperCase()].userAvailAmount==''
                ){ //账户余额小于0，为空，用户余额少于最低投资数量，
                    this.assignSaleinputopt({show:false})
                    this.$MessageBox.alert(`${obj.coin.toUpperCase()} balance is insufficient, please recharge`,{
                        title:'Tip',confirmButtonText:'Confirm',showCancelButton:true,cancelButtonText:'Cancel'}).then((action)=>{
                        if(action=='confirm'){
                            this.$router.push({ path:'/Wallet',query:{redirect:this.$route.fullPath}})
                        }
                    })
                    return
                }
                if(parseFloat(obj.amount)>Math.floor(parseFloat(this.userico[obj.coin.toUpperCase()].userAvailAmount))){ //输入量>用户余额
                    this.$MessageBox.alert(`${obj.coin.toUpperCase()} balance is insufficient, please recharge`,{
                        title:'Tip',confirmButtonText:'Confirm',showCancelButton:true,cancelButtonText:'Cancel'}).then((action)=>{
                        if(action=='confirm'){
                            this.$router.push({ path:'/Wallet',query:{redirect:this.$route.fullPath}})
                        }
                    })
                    return
                }   
                this.userico.ico.amount=obj.amount
                this.assignSaleinputopt({
                    show:true,
                    type:1,
                    placeholder:'Google Code',
                    title:'Enter Google Code',
                    isdecimal:false
                })
            }else if(Number(obj.type)==1){ //校验谷歌验证码
                if(illegallist.includes(obj.amount)){
                    this.$toast('google code must be six digits')
                    return 
                }
                if(this.activityinfo.status==0){ //活动未开始
                    this.$toast('Activity has not yet started')
                    return
                }
                if(this.activityinfo.status==2){ //活动已结束
                    this.$toast('The event is over')
                    return
                }
                this.userico.ico.googleCode=parseInt(obj.amount)
                this.assignSaleinputopt({disabledbtn:true})
                this.$axios.post('/trade/ico/invest',{
                    borrowId:this.userico.ico.borrowId,
                    googleCode:this.userico.ico.googleCode,
                    amount:this.userico.ico.amount,
                    access_token:this.LEND.localStorage('access_token')
                }).then((res) => {
                    switch (Number(res.code)) {
                        case 2000:
                            this.$toast('Success');
                            this.assignSaleinputopt({
                                show:false,
                                type:0, 
                                coin:null, 
                                placeholder:null, 
                                title:null, 
                                maxiptnum:null, 
                                miniptnum:null, 
                                isdecimal:true,
                                disabledbtn:false
                            });
                            this.userico.ico=Object.assign(this.userico.ico,{ 
                                borrowId:null , 
                                googleCode:null , 
                                amount:null 
                            })
                            if(true){ //this.activityinfo.status==1||this.activityinfo.status==2
                                this.mergerequest() //进入后合并多个请求
                            }
                        break;
                        case -1:this.$toast(res.message);this.assignSaleinputopt({disabledbtn:false});break;
                        default:this.$toast(res.message);this.assignSaleinputopt({disabledbtn:false});break;
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        showinvestment(){ //展示投资记录
            this.userico.showrecords=!this.userico.showrecords
            this.getusericoinvestlist()
        },
        closemyicondialog(){ //关闭投资记录
            this.userico.showrecords=false
        },
        filterdatetime(str){ //过滤时间
            if(!str){
                return
            }
            str=parseInt(str)
            return `${new Date(str).getFullYear()}.${this.checkTime(new Date(str).getMonth()+1)}.${this.checkTime(new Date(str).getDate())}  ${this.checkTime(new Date(str).getHours())}:${this.checkTime(new Date(str).getMinutes())}:${this.checkTime(new Date(str).getSeconds())}`
        },  
        ...mapActions(['changeState'])
    },
    components: {
        TokenSaleinput,swiper,swiperSlide
    },
    destroyed(){ 
        clearInterval(this.activityinfo.timer)
        this.activityinfo.timer=null
    }
};
</script>
<style lang="sass" scoped>
@import "./TokenSale.scss";
</style>