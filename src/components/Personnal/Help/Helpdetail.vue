<template>
    <div id="usercenter">
        <template v-if="selected==1">
        <div class="header_pl">
            <div class="headerline">
                <img src="https://s.lendx.vip/static/en/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                <p>Rate Instructions</p>
            </div>  
        </div>
            <div class="trans-rate">
                <p>Transaction fee: free during internal test</p>
                <p>Deposit fee:<b>free</b></p>
                <p>Withdrawal fee: Miners charge fees</p>
                <p>Mining fee which will be adjusted according to real-time situation</p>
                <div class="payinfo">
                    <ul>
                        <li>Type</li><li>BTC</li><li>ETH</li><li>EOS</li><li>GXS</li><li>USDT</li></ul><ul><li>Fullname</li><li>Bitcoin</li><li>Ethereum</li><li>EOS</li><li>GXS</li><li>TetherUS</li></ul><ul><li style="padding: 0;text-align: center;">Withdrawal fee</li><li>0.0005 BTC</li><li>0.008 ETH</li><li>0.3 EOS</li><li>0.3 GXS</li><li>10 USDT</li>
                    </ul>
                </div>
            </div>
        </template>
        <template v-if="selected==2">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/en/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>Risk Management</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>1. Police Line and Peace Store Line</h4>
                <p class="ptitle">The volatility of digital assets, especially virtual tokens, as well known. We have also taken into consideration  the plunge in mortgage assets. Our response will use the stock market's more mature “stock pledge” to assess the mortgage assets of each loan, and then establish a warning line (70%) and a closing line (50%). When the mortgage assets reach the warning line during the loan period, the system will prompt the end of the reminder, e-mail/text message to remind the lender to ask them to increase the collateral, so as to ensure that they will not be closed, to protect their rights and interests. After the additional collateral, a new cordon and closing line will be redrafted at this time, and the reminder will be repeated when the second trigger occurs. When the mortgage assets reach the liquidation line, in order to protect the interests of the borrower, the mortgage assets will be processed for delivery, and the mortgage lender will no longer own the mortgaged assets, and the assets will be owned by the investor after the delivery processing.
Settlement of volatility: After deducting the fees (if any), the lender's mortgage assets are directly transferred to the investor's account. Closing transactions due to market value will not be recorded as a credit stain on the lender.</p>
                <h4>2. Loan default risk</h4>
                <p class="ptitle">Before the end of the loan period, LendChain will remind the lender through system prompts, emails/text messages to return the loan on time. When the overdue time reaches 7 days, LendChain will take delivery of the mortgaged assets. After deducting the overdue fee, the assets will be returned to the borrower according to the investment proportion, and the remaining part will be returned to the lender. At the same time, the lender's overdue status is recorded in the LendChain blockchain, which will affect the user's credit rating. In the future, when the user continues to use the loan service, the record will be displayed to all borrowers in order to regulate and eliminate malicious Loan behavior. Due to the existence of mortgage assets, investment users actually do not face the risk of loan default.</p>
                <h4>3. Risk Reserve</h4>
                <p class="ptitle">The LendChain platform will have a risk reserve to cope with unexpected asset risk events, pay the user as the case may be, and protect the user from loss due to the platform.</p>
            </div>
        </template>
        <template v-if="selected==3">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/en/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>User Guide</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>1.Sign Up</h4>
                 <p class="ptitle">Open your lendchain and  tap [Me] ,then click [Sign Up/Login]</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/2_1.png'" alt="" srcset="">
                <p class="ptitle">2.Click sign up and go to registration page</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/2_2.png'" alt="" srcset="">
                 <p class="ptitle">3.Enter email address and password (a mix of uppercase letters, lowercase letters, numbers, and symbols), enter email verification code and finish</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/2_3.png'" alt="" srcset=""> 
                <h4>Google Authentication installation and application </h4>
                <p class="ptitle">①IOS</p>
                <p class="ptitle">(1)Search ‘Google Authentication’ in APP STORE and download</p>
                <p class="ptitle">(2)Install and open Google Authenticator, click 【+】</p>
                 <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_1.png'" alt="" srcset="">
                <p class="ptitle">(3)In Google Authentication page, scan QR code or enter private key</p>
                 <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_2.png'" alt="" srcset="" >
                <p class="ptitle">(4)Add account, 6 digits presented is Google Verification Code</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_3.png'" alt="" srcset="">
                <p class="ptitle">(5)Enter Google Verification Code and finish.</p>
                 <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_2.png'" alt="" srcset="">
                <p class="ptitle">②Android</p>
                <p class="ptitle">(1)Search ‘Google Authentication’ or ‘谷歌身份验证器’ in Google Play or browser, download it.</p>
                <p class="ptitle">(2)Install and open Google Authenticator, click 【+】</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_5.png'" alt="" srcset="" >
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_6.png'" alt="" srcset="" >
                <p class="ptitle">(3)In Google Authentication page, scan QR code or enter private key</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_2.png'" alt="" srcset="">
                <p class="ptitle">(4)Add account, 6 digits presented is Google Verification Code</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_3.png'" alt="" srcset="" >
                <p class="ptitle">(5)Enter Google Verification Code and finish.</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/0_2.png'" alt="" srcset="" >
                <h4>How to deposit</h4>
                <p class="ptitle">First, visit www.lendchain.io and log in.</p>
                <p class="ptitle">The second step, click on [My Assets] section, according to the currency you want to recharge, click on the "Withdraw" button</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/3_2.png'" alt="" srcset="">
                <p class="ptitle">The third step is an example for how to use Binance to recharge BTC into LendChain. Copy BTC address [recharge address] of lendchain and paste it on the BTC [Withdrawal Address] on Binance, fill in the number of withdrawals, and click [Withdrawa] To complete the recharge.</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/3_3.png'" alt="" srcset="">
                <p class="ptitle">Step 4, cash out the query: go back to the home page, click [My Assets] → [Accumulator Record] → [Withdrawal Record] to query the withdrawal details of the corresponding currency.</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/3_4.png'" alt="" srcset="">
                <h4>How to withdraw cash</h4>
                <p class="ptitle">The first step is to open the LendChain official website (mobile.lendx.vip/en) and log in to your account.</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/4_1.png'" alt="" srcset="">
                <p class="ptitle">The second step, click on [My Assets] section, according to the currency you want to recharge, click on the "Withdraw" button, enter the withdrawal address, withdrawal amount, and then click on the "return" in the lower right corner, enter the Google verification code.</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/4_2.png'" alt="" srcset="">
                <p class="ptitle">In the third step, the system automatically sends a confirmation e-mail to the registered e-mail address, then click [confirmed withdrawal] to complete withdrawal.</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/4_3.png'" alt="" srcset="">
                <p class="ptitle">Step 4, cash out the query: go back to the home page, click [My Assets] → [Accumulator Record] → [Withdrawal Record] to query the withdrawal details of the corresponding currency.</p>
                <img v-lazy="'https://s.lendx.vip/static/en/images/personnal/module8/4_4.png'" alt="" srcset="">
            </div>
        </template>
        <template v-if="selected==4">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/en/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>Mortgage Loan Instruction</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>Mortgage Loan Instruction</h4>
                <p class="ptitle">1.Loan users complete identity and security certification;</p>
                <p class="ptitle">2.The borrower shall recharge a certain digital currency as collateral, and the digital currency may be BTC, ETH, GXS, EOS, etc.;</p>
                <p class="ptitle">3.Borrowing users issue bid targets, choose to borrow digital currency types (including USDT, bit CNY, BTC, ETH, GXS, etc.), and customize interest (we will give recommended interest). After the bid is released, the mortgage digital currency will be locked.</p>
                <p class="ptitle">4.If within 24 hours, 100% of the bid target is raised, the loan will become effective.</p>
                <p class="ptitle">5.If the underlying investment does not reach 100% within 24 hours, or if the price of the mortgage digital currency floats more than 20% within 24 hours, the target will automatically become invalid and the digital currency of the investment will be returned to the investor.</p>
                <p class="ptitle">●For investment users, after landing on the LendChain platform, you can select the investment target according to various conditions such as interest rate, duration, and currency, and then recharge the corresponding digital currency to submit the application.</p>
                <p class="ptitle">●When the investment target raise to 100%, the investment becomes effective, and the principal and interest will be received after the repayment is due.</p>
                <p class="ptitle">●If the loan is overdue, after the borrower finally repays, the investment user will receive overdue fees in addition to the original interest rate gains. Because of the cost, the overdue fee platform will charge 30%.</p>
            </div>
        </template>
        <template v-if="selected==5">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/en/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>Application Scenario</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4 style="padding-bottom: .4rem;">The following figure shows the actual application scenarios of several mortgage loans.</h4>
               <div>
               <h5>First Dialogue:</h5>
               <p>Lucas: The recent sharp fall in the currency price, you have a vision to clear the bitcoin early.</p>
               <p>Oscar: Haha, I’ve earned some more.</p>
               <p>Lucas: Ah? Tell me what you have do?</p>
               <p>Oscar: Recently, there is a platform called LendChain. I have mortgaged my USDT then I have sold 10 BTCs for more than 100,000 USDT. Then I bought back 10.5 BTCs back in 70,000 USDT and i earned too much money.</p>
               <p>Lucas: A borrowing platform can work like this ! Ah, you are really a genius.</p>
               </div>
               <div>
               <h5>Second Dialogue:</h5>
               <p>Lucas: Oscar, POA pulled up a lot last night, you earn a lot of it.</p>
               <p>Oscar: Haha, I’m 150%</p>
               <p>Lucas: Did you sell your EOS or GXS to buy POA?</p>
               <p>Oscar: No, I mortgaged my own EOS and GXS on LendChain and borrowed ETH to buy POA. I just sold some POA and put ETH on it.</p>
               <p>Lucas: Wow very good, this wave of operation is extremely good.</p>
               </div>
                <div>
               <h5>Third Dialogue:</h5>
               <p>Lucas: Oscar, the recent Crypto market is not that good, How about you ?</p>
               <p>Oscar: I couldn’t get a lot of BTC out of my hands, but recently I put most of the BTCs on the LendChain platform and I’ve got a good return every month.</p>
               <p>Lucas: This is not a big risk ?</p>
               <p>Oscar: No, LendChain has a mortgage on it, backed by a collateral for virtual currency guarantees, and has set up a security alert. In the worst case, I can also get the equivalent of a collateral currency.</p>
               <p>Lucas: It’s safe! Then I also want to mortgage my BTCs.</p>
               <p>Oscar: Not only BTC, but also USDT, ETH and more.</p>
               </div>
                <div>
               <h5>Fourth  Dialogue:</h5>
               <p>Lucas: Oscar, there is no money for money management, and there is no need for mortgage loans.</p>
               <p>Oscar: You can become Leader’s promotion commissioner, Just invite someone to sign up for LendChain, you can get 25% fee, If he invites other people to register, you can also get a 10% fee.</p>
               <p>Lucas: So high, then I must do it quickly.</p>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      imgs: [
        "https://lendchain.oss-cn-shanghai.aliyuncs.com/help/6_1.png",
        "https://lendchain.oss-cn-shanghai.aliyuncs.com/help/6_2.png",
        "https://lendchain.oss-cn-shanghai.aliyuncs.com/help/6_3.png",
        "https://lendchain.oss-cn-shanghai.aliyuncs.com/help/6_4.png"
      ]
    };
  },
  props: ["selected"],
  methods: {
    cancelalert() {
      this.$emit("cancelalert");
    }
  }
};
</script>
<style scoped>
.header_pl {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}
.headerline {
  height: 1.17rem;
  line-height: 1.17rem;
  font-size: 16px;
  background-color: #fff;
  margin-bottom: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.headerline img {
  position: absolute;
  left: 0;
  height: 1.17rem;
  z-index: 91;
  padding: 0.4rem;
  float: left;
}
.risk-manage img {
  max-width: 100%;
}
.risk-manage {
  font-size: 12px;
  padding: 0.5rem 0.4rem;
  background-color: #fff;
}
.risk-manage h4 {
  font-size: 18px;
  margin-top: 1rem;
  font-weight: 400;
  color: #262626;
}
.risk-manage p.ptitle {
  margin-top: 10px;
}
.risk-manage p {
  line-height: 18px;
  text-align: left;
}

.trans-rate > p {
  text-align: center;
  font-size: 16px;
  padding: 0.5rem 0 0 0;
}
.payinfo {
  margin-top: 10px;
  overflow: hidden;
}
.payinfo ul {
  width: 33.3%;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  float: left;
}
.payinfo li {
  border: 1px solid #e6e6e6;
  margin: -1px;
  text-align: left;
}
.payinfo ul li {
  font-size: 14px;
  line-height: 40px;
  padding-left: 20px;
}
#usercenter {
  position: absolute;
  z-index: 1000;
  width: 100%;
  min-height: 100%;
  top: 0;
  background-color: #f5f5f5;
}
#usercenter > img:first-child {
  position: absolute;
  z-index: 91;
  height: 0.45rem;
  left: 0.4rem;
  top: 0.4rem;
}
.trans-rate {
  background-color: #fff;
  text-align: right;
}
image[lazy="loading"] {
  width: 40px;
  height: 300px;
  margin: auto;
}
</style>
