<template>
    <div id="_borrowinfo">
        <addcollateral v-if="alertmodule==2" :zhuijiaborrowitem="zhuijia_borrowItem"  @cancelalert="successFun"></addcollateral>
        <div class="header_pl">
            <div class="headerline">
                <img src="../../../../static/images/icon/pic_navb.png" @touchend="cancelalert" alt="back"> 
                <p style="text-align: center;">Borrow Details</p>
            </div>  
            <div class="borrowstatus">
                <span>Status:</span>
                <span :class="computedClass(myBorrowinfo.status)">{{getBorrowStatus(myBorrowinfo.status)}}</span>
            </div>  
            <div class="myinvestlist">
                <div class="myinvesttype">
                    <div class="ct_myinvesttype">
                        <p><span>Order Id:</span><span :class="computedClass(myBorrowinfo.status)">{{myBorrowinfo.orderId}}</span></p>
                        <p><span>Borrow Amount</span><span>{{myBorrowinfo.borrowAmount}} {{myBorrowinfo.borrowCryptoCode}}</span></p>
                        <p><span>Interest</span><span>{{myBorrowinfo.interest?parseFloat(myBorrowinfo.interest.toFixed(6)):''}} {{myBorrowinfo.borrowCryptoCode}}</span></p>
                        <p><span>Expiration time</span><span>{{filterdatetime(myBorrowinfo.deadline)}}</span></p>
                        <p><span>Time to issue</span><span>{{myBorrowinfo.createTime}}</span></p>
                        <p><span>Full time</span><span>{{myBorrowinfo.quotaFullTime}}</span></p>
                        <p><span>Repayment time</span><span>{{myBorrowinfo.realPaybackTime}}</span></p>
                        <p><span>Mortgage</span><span>{{myBorrowinfo.mortgageAmount}} {{myBorrowinfo.mortgageCryptoCode}}</span></p>
                        <p><span>Recruitment percentage</span><span>{{(myBorrowinfo.boughtPercent*100).toFixed(2)}}%</span></p>
                    </div>
                    <div class="btns" >
                        <div  v-if="myBorrowinfo.status==1" class="btn1" @touchend="gobackmoney">Repay</div>
                        <div  v-if="(myBorrowinfo.status==0)||(Number(myBorrowinfo.status)==1)" class="btn1" @touchend="changealertm(2)">Add mortgage</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import addcollateral from './Addcollateral'
import gauthponent from '../../common/gauthcontent.vue'
export default {
    data() {
        return {
            act: "",
            hassend: false,
            alertmodule: 0,
            zhuijia_borrowItem: {},
            access_token: this.LEND.localStorage('access_token')
        }
    },
    props: ["action",'borrowinfo'],
    components:{
        'addcollateral': addcollateral,
        'gauthponent': gauthponent
    },
     computed:{
        myBorrowinfo(){
            return this.borrowinfo
        }
    },
    methods:{
        showpetty(id) {
            window.scrollTo(0,0);
            this.$axios.get(`/trade/borrow/detail?borrowId=${id}`).then(res => {
                if (Number(res.code) == 2000) {
                    this.myBorrowinfo.mortgageAmount = res.data.mortgageAmount;
                } else {
                    this.$toast(res.message);
                }
            })
        },
        computedClass:function(status){
            if (Number(status) == 0) {
                return 'active';
            } else if (Number(status) > 10) {
                return 'darkcolor';
            } else {
                return 'common'
            }
        },
        usefixfloat:function(val){
            return this.LEND.fixFloat(val)
        },
        getBorrowStatus: function(code) {
            var reString = this.LEND.getBorrowStatus(code);
            return reString;
        },
        gauthconfirm(e, arg) {
            if (t == 0) {
                this.$data.alertmodule = 0;
            } else if (t == 1) {
                this.$data.alertmodule = 1;
            }
        },
        changealertm: function(num,id) {
            let obj = { //从父组件获取需要的相关数据组成新对象
                mortgageAmount: this.myBorrowinfo.mortgageAmount,
                mortgageCryptoCode: this.myBorrowinfo.mortgageCryptoCode,
                mortgageCryptoId: this.myBorrowinfo.mortgageCryptoId,
                borrowCryptoCode: this.myBorrowinfo.borrowCryptoCode,
                borrowAmount: this.myBorrowinfo.borrowAmount,
                borrowId: this.myBorrowinfo.id,
                borrowCryptoId: this.myBorrowinfo.borrowCryptoId
            }
            this.zhuijia_borrowItem = obj;
            num = num || 0
            this.alertmodule = num;
        },
        gobackmoney: function() {
            let alertstring = ''
            let _borrnow = {};
            let layerid1;
            var deadLine = String(new Date(this.myBorrowinfo.deadline).getTime()).slice(0,10);
            var nowTime = String(new Date().getTime()).slice(0,10);
            if (nowTime < deadLine){
                alertstring = " whether it is  Early Repayment?"
            } else if (nowTime == deadLine) {
                alertstring = " whether to Repayment?"
            } else {
                alertstring = " overdue payments?"
            }

                     layerid1 = this.$MessageBox.alert('Confirm' + alertstring + '?', {
                title: alertstring,showCancelButton:true,confirmButtonText:'Confirm',cancelButtonText:'Cancel'
            }).then(action => {
                if(action=="cancel"){
                    return;
                }
                this.$axios.post('/trade/borrow/payback', {
                    borrowId: this.myBorrowinfo.id,
                    access_token: this.access_token
                }).then((result) => {
                    switch (Number(result.code)) {
                        case 2000:
                            this.$toast('Repayment successful, please wait patiently for response');
                            this.$emit('cancelalert');
                            break;
                        case 2010:
                           this.$toast('tips:Insufficient balance to recharge')
                        default:
                            this.$toast(result.message);
                            break;
                    }
                }).catch(err=>{
                    this.$toast(err)
                })
                this.$layer.close(layerid1);
            })
        },
        cancelalert(e) {
            this.$emit('cancelalert')
        },
        successFun(){
            this.alertmodule = 0;
            this.showpetty(this.myBorrowinfo.id);
        },
        filterdatetime(str){ //过滤时间
            if(!str){
                return
            }
            var time = new Date(Number(str)*1000)
            var y = time.getFullYear()
            var m = time.getMonth() + 1
            var d = time.getDate()
            var h = time.getHours()
            var mm = time.getMinutes()
            var s = time.getSeconds()
            return y + '.' + m + '.' + d + ' ' + (Number(h) < 10 ? ('0' + h) : h) + ':' + (Number(mm) < 10 ? ('0' + mm) : mm) + ':' + (Number(s) < 10 ? ('0' + s) : s)
        }
    }
};
</script>
<style scoped>
#_borrowinfo{position: absolute;top:0;z-index:9999;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;}
.personnal .header_pl{background-color:#f5f5f5;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;margin-bottom:10px;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;;float:left;}
.myinvesttype{margin-bottom:10px;background-color:#fff;}
.borrowstatus{height:1.33rem;line-height:1.33rem;font-size:16px;color:#262626;margin:10px 0;text-align:left;padding:0 .4rem;background-color: #fff;}
.borrowstatus .common{position: absolute;right:.4rem;}
.borrowstatus .active{position: absolute;right:.4rem;color:#509fff;}
.myinvesttype{font-size:14px;}

.myinvesttype .ct_myinvesttype{color:#262626;text-align:left;background-color:#fff;padding:.4rem .4rem 1.8rem .4rem;}
.myinvesttype .ct_myinvesttype p{margin-bottom:.2rem;color:#999;}
.myinvesttype .ct_myinvesttype p span:nth-child(2){position:absolute;right:.4rem;color:#595959;}
.myinvesttype .btns{display:flex;justify-content: space-around;}
.myinvesttype .btns .btn1{width:3.73rem;height:1rem;line-height:1rem;border-radius:4px;margin-bottom:1.25rem;text-align:center;}
.myinvesttype .btns div:nth-child(1){color:#fff;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
.myinvesttype .btns div:nth-child(2){color:#509fff;border:1px solid #509fff;}
</style>
