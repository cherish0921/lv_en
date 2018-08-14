<template>
  <div class="shadebg">
    <transition name="lendchainfade1">
        <div>
            <div class="toumingshade" v-if="toumingshow" >
                <img v-if='type=="b"' src="../../../static/images/icon/trueoptb@2x.png" alt="">
                <img v-if='type=="i"' src="../../../static/images/icon/trueopti@2x.png" alt="">
            </div>
            <header class="clearfloat">
                <img @touchend="rollback" src="../../../static/images/icon/pic_navb.png" alt="" srcset="">
                {{title}}
            </header>
            <div>
                <p class="bindtip">温馨提示：记得备份谷歌二维码或密钥</p>
                <div class="googlearea">
                    <p>谷歌二维码及密钥：</p>
                    <div>
                        <span id="qrcode"></span>
                        <span style="padding-left:0"><input id="qrcodeTxt" readonly  type="text" :value="googleSecret"></span>
                         <span class="active"  ref="copy" data-clipboard-action="copy"  data-clipboard-target="#qrcodeTxt" @touchend="copyTxt">复制</span>
                    </div>
                </div>
            </div>
            <div class="content_gauth">
                <div class="gcode clearfloat">
                    <span>验证码</span>
                    <input type="text" v-model="gcode"  placeholder="请输入谷歌验证码">
                </div>
                <div class="gcode clearfloat"  style="clear:both;">
                    <span>短信验证码</span>
                    <input type="text" v-model="phonecode"  placeholder="请输入短信验证码">
                    <span class="active" v-show="!isgetting"  @touchend="sendcode">发送验证码</span> 
                    <span style="color:#999;" v-show="isgetting"  id="Countdownvala">发送验证码</span> 
                </div>

            </div>
            <div class="intru">
                <p class="font12">
                    操作步骤：<br>
                    1.安装在“Google Authenticator”应用程序中，点击右上角“+”号，然后选择“手动输入验证码”。  
                </p>
                <p class="font12">
                2.粘贴上面的“密钥”到“密钥”输入栏，并填写您的lendchain账号，点击“完成”。
                </p>
                <p class="font12">
                3.复制“谷歌验证码”，粘贴到上面的“谷歌验证码”输入栏。
                    请勿删除此双重验证密码账户，否则会导致您无法进行账户操作；如果误删，您可通过重置密钥重新获取。
                </p>
                <p class="font12">
                4.请妥善保管好你的密钥，如遇手机丢失，你可以通过该密钥恢复你的谷歌验证。
                </p>
            </div>
            <div class="confirmbtn" @touchend="confirm">{{btntext}}</div>
        </div>
    </transition>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2';

let endtime = 60;
let interval;

export default {
data(){
    return{
        gcode:'',      //谷歌验证码
        phonecode:'',  //手机验证码
        wrongtipshow:false,
        toumingshow:false,
        isgetting: false,
        googleSecret:'', //谷歌秘钥
        email:'',
        access_token:this.LEND.localStorage('access_token')
    }
},
  props:['title','gtext','btntext','type','redirect'],
  created(){
      this.$axios.get('/trade/mfa/generate').then( res=> {
          if (Number(res.code) !== 2000) {
              this.$toast(res.message.toString());
              return;
          }else{
              this.googleSecret =  res.data.secret;
              this.email=  res.data.email;
              this.qrcode();
          }
      });    
        this.copyBtn1 = new this.clipboard(this.$refs.copy); 
  },
  mounted(){
  },
  methods:{
      copyTxt(){
        let _this = this;
        let clipboard =query==1? _this.copyBtn1:_this.copyBtn2;
            clipboard.on('success', (e) =>{
              this.$toast('successful copy')
            });
            clipboard.on('error', function(e) {
                 this.$toast('Copying is not supported on your device, please copy it manually')
            });  
      },
      qrcode() { //生成二维码
          let that = this;
          let qrcode = new QRCode('qrcode', {  
              width: 80,  //宽度
              height: 80, // 高度  
              text: `otpauth://totp/${this.email}?secret=${this.googleSecret}&issuer=lendx.vip`// 二维码内容  
          })  
      },
      rollback:function(){
          this.$emit('cancelalert');
      },
      sendcode(){
          this.$axios.post('/trade/sms/send',{access_token:this.access_token}).then( res=> {
              if (Number(res.code) !== 2000) {
                  this.$toast(res.message.toString());
                  return;
              }
              this.isgetting = true;
              endtime = 60;
              if (this.isgetting) {
                  interval = setInterval(() => {
                      if (endtime >= 0) {
                          if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "重新发送(" + endtime + ")";
                          endtime--;
                      } else {
                          this.isgetting = false;
                          endtime = 60;
                          if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "发送验证码"
                          clearInterval(interval);
                          this.$router.replace({path:this.redirect}); //成功后重定向回原来的路由
                      }
                  }, 1000)
              }
          });
      },
      confirm(){
          // if(this.$props.type==='i'){
          //  this.$emit('confirm',this.$data.gcode)
          // }else 
          if(this.$props.type=='r'){
              this.$axios.post("/trade/mfa/auth", { google_code:this.gcode,sms_code: this.phonecode,access_token: this.access_token}).then((res) =>{
                  switch (Number(res.code)) {
                      case 2000:
                      {
                          this.$toast('谷歌认证成功');
                          if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "发送验证码"
                          clearInterval(interval);
                          this.isgetting = false;
                          this.activePhone = this.LEND.localStorage('igoogle',1);
                            if (this.redirect) { //存在就重定向回原来的路由
                                this.$router.replace({path: this.redirect});
                            } else { //不存在就隐藏弹窗
                                this.$emit('cancelalert');
                            }
                          // this.$emit('cancelalert');
                          break;
                      }
                      default:
                      {
                          this.$toast('请求错误');
                      }
                  }
              }); 
          }
      }
  }
}
</script>

<style scoped>
.shadebg{position: fixed;width: 100%;min-height:100%;top:0;left:0;right:0;z-index:100;background-color:#f5f5f5;}
header{margin-bottom:.28rem;height:1.17rem;line-height:1.17rem;font-size: 16px;color:#000;background-color: #fff;box-shadow:1px 0px 0px rgba(0,0,0,0.1)}
header img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;;float:left;}
header span{line-height: 1.17rem;height:1.17rem;}
.content_gauth{text-align: left;}
.content_gauth >div>span{display: inline-block;}
.content_gauth >div>span:first-child{width: 3rem;text-align: left;padding-left: .4rem;color:#999;}
.content_gauth >div>span:last-child{float: right;text-align: right;padding-right:0;}
.content_gauth .gtext,.content_gauth .gcode{height:1.33rem;line-height:1.33rem;font-size: 14px;background-color: #fff;}
.content_gauth .gcode:nth-child(2){border-top:1px solid #e6e6e6;}
.content_gauth .gtext{border-bottom:1px solid #e6e6e6;}
.content_gauth .gtext input,.content_gauth .gcode input{font-size: 16px;background-color: inherit;border: 0;}
.intru{font-size: 12px;text-align: left;margin-top: .55rem;padding:0 .4rem;}
.wrongtip{color:#FF1818;font-size: 12px;margin: .48rem 0 .25rem .4rem;text-align:left;}
.confirmbtn{margin:.5rem .4rem .8rem .4rem;height:1.17rem;line-height:1.17rem;border-radius:4px;background-color:#509fff;color:#fff;font-size:16px; }

.bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;margin-top:-10px;}
.googlearea {padding:.4rem;text-align:left;background-color:#fff;margin-bottom:10px;margin-top:10px;}
.googlearea p{height:1.16rem;line-height:1.16rem;font-size:14px;color:#999;}
.googlearea div,.googlearea div img{height:2.13rem;line-height:2.13rem;vertical-align: middle;font-size:16px;color:#262626;}
.googlearea div .active,.content_gauth  .active{position: absolute;color:#509fff;right:.4rem;}
.toumingshade{position:fixed;width:100%;height:100%;top:0;left:0;right:0;z-index: 110;background-color: rgba(0,0,0,0.3)}
.toumingshade img{position: relative;z-index:111;top:5rem;;width:2.4rem;}
#qrcode{
    display: inline-block;
    vertical-align: middle;
}
#qrcodeTxt{
    outline: none;
    border:0;
    font-size: 16px;
    color: #262626;
    line-height: 2.13rem;
}
</style>