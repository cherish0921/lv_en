<template>
	<div id="_borrowinfo">
	    <verification v-if="showGoogle" @getGoogleCode="getGoogleCode" @hideVerification="cancelputty"></verification>	
		<resulttip v-if="zhuijia_status" :_status="zhuijia_status" @canceltip="changestatus"></resulttip>
		<div class="header_pl">
			<div class="headerline">
				<img src="../../../../static/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
				 <p style="text-align:center;s">Add</p>
			</div>  
			<div class="myinvestlist">
				<div class="myinvesttype">
					<div class="ct_myinvesttype">
						<p><span>Mortgage price</span><span>1&nbsp;{{zhuijiaborrowitem.mortgageCryptoCode}} ≈ {{nowPrice}}&nbsp;
									 {{zhuijiaborrowitem.borrowCryptoCode}}</span></p>
						<p><span>Mortgage Amount</span><span>{{zhuijiaborrowitem.mortgageAmount}}&nbsp;{{zhuijiaborrowitem.mortgageCryptoCode}}</span></p>
						<p><span>Mortgage rates</span><span>{{mortgageFull}}%<i v-if="Number(mortgageFull)<150" style="color:red">（Below the warning line）</i></span></p>
					</div>
					<div class="ct_myinvesttype">
						<p><span class="titlecolor">Add</span><span>&nbsp;</span></p>
						<p class="inputadd titlecolor"><input placeholder="Enter amount" v-model="input_zhuijia"><span class="darkcolor">{{zhuijiaborrowitem.mortgageCryptoCode}}</span></p>
						<p class="afteradd"><span class="darkcolor">Updated mortgage rates:<i class="blue">{{getmortgageFull(zhuijiaborrowitem,Number(zhuijiaborrowitem.mortgageAmount)+Number(input_zhuijia))}}%</i> </span><span class="blue" @touchend="goToRecharge">Recharge</span></p>
						</div>
					<div class="confirmbtn" style="text-align:center;" @touchend="confirm">Confirm</div>
				</div>
			</div>
	    </div>
	    <recharge v-if="rechargeShow" @cancelputty="cancelputty" :borrowitem="zhuijiaborrowitem"></recharge>	
	</div>
</template>
<script>
import resulttip from '../../common/resulttip'
import verification from '@/components/Personnal/Comm/verification'
import recharge from '@/components/Personnal/Comm/Recharge'

var timeout_cp;
export default {
	data() {
		return {
			act: "",
			input_zhuijia:'',
			zhuijia_borrowItem:{},
			zhuijia_status:0,//追加成功1，追加失败2
			mortgageFull:0,
			nowPrice:'', //市价格
			symbol:'', //币种的换算参数symbol
			showGoogle:false,  //默认谷歌验证弹窗不显示
			rechargeShow:false, //默认充值页面不显示
			userremain:'',
			access_token:this.LEND.localStorage('access_token')
		};
	},
	props:["zhuijiaborrowitem"],
	created(){
       
	},
	mounted() {
		//  this.getPriceFun(this.zhuijiaborrowitem.mortgageCryptoCode,this.zhuijiaborrowitem.borrowCryptoCode);
		 this.getPriceFun(this.zhuijiaborrowitem.mortgageCryptoId,this.zhuijiaborrowitem.borrowCryptoId);
	},
	components:{
		resulttip,
		verification,
		recharge
	},
	methods: {
		goToRecharge(){
            this.rechargeShow = true;
		},
		cancelputty(){
            this.showGoogle = false;
            this.rechargeShow = false;
		},
		getGoogleCode(googleCode){
            this.toAppendFun(googleCode);
		},
		changestatus:function(boo){
			if(boo){
				 this.$emit('cancelalert')
			}else{
				this.$data.zhuijia_status=0
			}
		},
		/*
		  getPriceFun:async function(mn,bn){
 let symbolObj = { "BTC": 1000,"ETH": 1001,"GXS": 1002,"QKC":1003},symbol1 = '',symbol2 = '',flag = '',price = 0,gerArr = [];;
            if(mn!="USDT"){ //当抵押币种不是USDT需请求
                flag = false;
                symbol1 = symbolObj[mn];
                if(bn!="USDT"){   //当借入币种不是USDT需请求
                    symbol2 = symbolObj[bn];
                }
            }else{  //当抵押币种是USDT则需要比率需要求反  flag作为求反的标识符
                flag = true;
                symbol2 = symbolObj[bn];
            }
            (symbol1)&&gerArr.push(this.$axios.get(`${this.Posturl}/price/latest?symbol=${symbol1}`)); 
            (symbol2)&&gerArr.push(this.$axios.get(`${this.Posturl}/price/latest?symbol=${symbol2}`)); 
                    if(gerArr.length == 1){
                      gerArr[0].then((res)=>{   //单个请求完成时
                      (res.code=='ok')?((flag)? (price = 1/res.data.price):(price = res.data.price)):this.$toast(res.message);  
					  	this.nowPrice = this.LEND.fixFloat(price);
						this.mortgageFull = this.getmortgageFull(this.zhuijiaborrowitem, Number(this.zhuijiaborrowitem.mortgageAmount));
					  })
						return (this.$data.nowPrice)
                  }else{
                      let that = this;
                      this.$axios.all(gerArr).then(this.$axios.spread(function (acct, perms) { //两个请求现在都执行完成
                      (acct.code=='ok' && perms.code=='ok')?( price= acct.data.price/perms.data.price): that.$toast(acct.message || perms.message);
					that.nowPrice = that.LEND.fixFloat(price);
					that.mortgageFull = that.getmortgageFull(that.zhuijiaborrowitem, Number(that.zhuijiaborrowitem.mortgageAmount));
                     })
                      );   
                        return (this.$data.nowPrice)
                  }  
	},*/
		getPriceFun:async function(mid,bid){//抵押币种id,借入币种id
                let that = this,price;
                  	this.$axios.get(`/trade/crypto/price?mortgageCryptoId=${mid}&borrowCryptoId=${bid}`).then(res=>{
						switch(Number(res.code)){
							case 2000:
							price=res.data.price;
							that.$data.nowPrice=res.data.price;
							that.mortgageFull = that.getmortgageFull(that.zhuijiaborrowitem, Number(that.zhuijiaborrowitem.mortgageAmount));
							break;
							default:
							this.$toast(res.message)
							break;
						}
					}).catch(err=>{
						
					});  
        },
		getmortgageFull:function(zhuijia_borrowItem, allval) {
			//  抵押充足率= 当前抵押品价格*追加后的抵押品总数量/借款币种数量
			return Number(this.nowPrice* (allval) /zhuijia_borrowItem.borrowAmount *100).toFixed(2);
		},
		cancelalert(e){
			this.$emit('cancelalert')
		},
		confirm:function (){
			if (isNaN(this.input_zhuijia)) {
				this.$toast('can only enter a number');
				return;
			}
			if (Number(this.$data.input_zhuijia) <= 0) {
				this.$toast('The number of additions must be greater than 0,please enter again');
				return;
			}
			this.$axios.get('/trade/asset/amount', {params: {'cryptoId':this.zhuijiaborrowitem.mortgageCryptoId}}).then( result => {
                switch (Number(result.code)) {
                    case 2000:
                        {
							if(Number(this.input_zhuijia)>Number(result.data.amount)){
								this.$toast('You not have such coin')
								return;
							}else{
							this.showGoogle = true;
							}
								
                            break;
						}
				}
			})
		},
		toAppendFun(googleCode){
			this.$axios.post('/trade/append/mortgate', {
				borrowId: this.zhuijiaborrowitem.borrowId,
				amount: this.input_zhuijia,
				googleCode: googleCode,
				access_token: this.access_token
			}).then((res) => {
				switch (Number(res.code)) {
					case 2000:
						this.$toast('success');
					    this.showGoogle = false;
						this.zhuijia_status = 1;
						this.$emit('cancelalert')
						break;
					case 2010:
						this.zhuijia_status = 2;
					default:
						this.$toast(res.message);
				}
			})
		}
	}
};
</script>
<style scoped>
#_borrowinfo{position:absolute;top: 0;z-index:9999;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;}
.personnal .header_pl{background-color:#f5f5f5;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;margin-bottom:10px;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;float:left;}


.myinvesttype .ct_myinvesttype{color:#262626;text-align:left;background-color:#fff;padding:.4rem;margin-bottom:10px;}
.myinvesttype .ct_myinvesttype p{margin-bottom:.2rem;color:#999;}
.myinvesttype .ct_myinvesttype:first-child p span:nth-child(1){display: inline-block;width:3rem;color:#999;}
.myinvesttype .ct_myinvesttype:first-child  p span:last-child{color:#595959;}
.myinvesttype .ct_myinvesttype:nth-child(2){padding:.4rem 0 0 0;}
.myinvesttype .ct_myinvesttype:nth-child(2) p span:nth-child(1),.myinvesttype .ct_myinvesttype:nth-child(2) p input{padding-left: .4rem;width: inherit;}
.myinvesttype .ct_myinvesttype:nth-child(2)  p:nth-child(1) span{color:#262626;}
.myinvesttype  .inputadd,.myinvesttype  .inputadd input,.myinvesttype  .inputadd span {height:1.33rem;line-height:1.33rem;}
.myinvesttype  .inputadd input{width:8rem;border:0;color:#262626;}
.myinvesttype  .inputadd span{position: absolute;right:.4rem;}
.myinvesttype .afteradd{border-top:1px solid #e5e5e5;height:1.1rem;line-height:1.1rem;margin:0;}
.myinvesttype .afteradd span:last-child{position:absolute;right:.4rem;color:#509fff;cursor: pointer;}
.myinvesttype .confirmbtn{margin:.4rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
		background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
		-webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
						box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
.myinvesttype .ct_myinvesttype p .blue{color: #509fff}
.titlecolor{color:#262626;}
.darkcolor{color:#595959}
</style>
