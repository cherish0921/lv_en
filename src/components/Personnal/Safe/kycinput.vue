<template>
    <div id="kycinput">
    <div class="header_pl">
        <div class="headerline">
            <img src="../../../../static/images/icon/pic_navb.png" @touchend="goBack" alt="返回"> 
            <p>Know Your Customer</p>
        </div>  
    </div>
        <div class="contents">
            <div class="form" v-if="!picsshow">
                <div class="borrowline selection clearfloat">
                    <span>Country</span> 
                    <div class="countrycode">
                        <contryCode :countryCode="countryCode" @excountry="excountry"></contryCode>
                    </div>
                </div>
                <div class="borrowline selection clearfloat">
                    <span>Name</span> 
                    <input v-model.trim="name" placeholder="Please enter your name"  maxlength="32"/>
                </div>
                <div class="borrowline selection clearfloat">
                    <span style="width:3rem;">Date Of Birth</span> 
                    <vuejs-datepicker :disabledDates ="disabledDates" :language='lang'  :value="defaultDate" :format="customFormatter" @selected="selecteddate"></vuejs-datepicker>
                </div>
                <div class="borrowline selection clearfloat">
                    <span>ID Type</span> 
                    <span  @touchend.stop.prevent="togglepopupVisible" >{{idselectval}} Card</span>
                </div>
               <mt-popup v-model="popupVisible" position="bottom"  popup-transition="popup-fade" style="width: 100%;">
                   <mt-picker :slots="popSlots" :showToolbar='true' @change="onValuesChange">
                       <div class="clearfloat">
                           <span  @touchend.stop.prevent="popupVisible=false">Cancle</span>
                           <span @touchend.stop.prevent="popupVisible=false">Confirm</span>
                       </div>
                   </mt-picker>
               </mt-popup>
                <div class="borrowline selection clearfloat">
                    <span>ID Number</span> 
                    <input v-model.trim="idnumber" placeholder="Please enter your ID number"  maxlength="32"/>
                </div>
                <div class="confirmbtn"  @touchend="confirm(true)">Next</div>
            </div>
            <div class="pics" v-if="picsshow" :class="idselectval=='ID'?'':'isid'">
                <p class="font14">Upload document materials</p>
                <div class="pic">
                    <div class="picarea halfarea">
                        <vue-core-image-upload
                            class="btn btn-primary"
                            :crop="false"
                            compress="60"  
                            id="uploader0"
                            @imagechanged="imagechanged(0)"
                            @imageuploading="imageuploading"
                            @imageuploaded="imageuploaded"
                            :max-file-size="5242880"
                            :url="upimgurl+'/trade/api/upload'" 
                            inputOfFile='file'
                            credentials=true
                            text="">
                             <img src="../../../../static/images/personnal/module6/i0.png">
                        </vue-core-image-upload>
                       
                    </div>
                    <div class="textarea halfarea">
                        <h4>{{(idselectval=='ID')?upimgtext.en.ID[0].title:upimgtext.en.Passport[0].title}}</h4>
                        <p>{{(idselectval=='ID')?upimgtext.en.ID[0].text:upimgtext.en.Passport[0].text}}</p>
                    </div>
                </div>
                <div class="pic">
                    <div class="picarea halfarea">
                            <vue-core-image-upload
                            class="btn btn-primary"
                            :crop="false"
                            compress="60"  
                            id="uploader1"
                            @imagechanged="imagechanged(1)"
                            @imageuploading="imageuploading"
                            @imageuploaded="imageuploaded"
                            :max-file-size="5242880"
                            :url="upimgurl+'/trade/api/upload'" 
                            inputOfFile='file'
                            credentials=true
                            text="">
                             <img src="../../../../static/images/personnal/module6/i0.png">
                        </vue-core-image-upload>
                    </div>
                    <div class="textarea halfarea">
                        <h4>{{(idselectval=='ID')?upimgtext.en.ID[1].title:upimgtext.en.Passport[1].title}}</h4>
                        <p>{{(idselectval=='ID')?upimgtext.en.ID[1].text:upimgtext.en.Passport[1].text}}</p>
                     </div>
                </div>
                <div class="pic">
                    <div class="picarea halfarea">
                        <vue-core-image-upload
                            class="btn btn-primary"
                            id="uploader2"
                            :crop="false"
                            compress="60"  
                            @imagechanged="imagechanged(2)"
                            @imageuploading="imageuploading"
                            @imageuploaded="imageuploaded"
                            :max-file-size="5242880"
                            :url="upimgurl+'/trade/api/upload'" 
                            inputOfFile='file'
                            credentials=true
                            text="">
                             <img src="../../../../static/images/personnal/module6/i0.png">
                        </vue-core-image-upload>
                    </div>
                    <div class="textarea halfarea">
                        <h4>{{(idselectval=='ID')?upimgtext.en.ID[2].title:upimgtext.en.Passport[2].title}}</h4>
                        <p>{{(idselectval=='ID')?upimgtext.en.ID[2].text:upimgtext.en.Passport[2].text}}</p>
                    </div>
                </div>
                 <div class="confirmbtn" @touchend="confirm(false)">Ok</div>
            </div>
        </div>
    <div class="bgshade" v-if="isuping" style="width:100%;height:100%;font-size:20px;padding-top: 30%;
    color: #fff;position:absolute;top:0;background-color:rgba(0,0,0,.6);z-index:999;">
        Please wait,image is uploading……
    </div>
    </div>
</template>
<script>
import contryCode from '../../../components/common/IntlTelInput/index';
//import VueCoreImageUpload from 'core/vue-core-image-upload.vue'//上传组件
import VueCoreImageUpload  from 'vue-core-image-upload';
import Datepicker from 'vuejs-datepicker';
import {en} from 'vuejs-datepicker/dist/locale';
import {Posturl} from '../../../../static/js/config.js'
export default {
      data() {
        return {
                picsshow:false,
                countryCode:'kr',//国别简写
                countrynum:82,//国别码
                name:'',
                lang:en,
                defaultDate:new Date(1990, 10,  10),
                disabledDates :{from: new Date()},
                popupVisible:false,//
                nowupuint:'',
                popSlots: [//
                        {
                        flex: 1,
                        values: ['ID', 'Passport'],
                        className: 'slot2',
                        textAlign: 'center'
                        }
                    ],
                idselectval:'ID',
                idnumber:'',
                picarr:[],
                bgimgs:[],
                isuping:false,
                upimgtext:{
                   'cn':{
                       'ID':[
                           {title:'Picture of ID(Front)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Picture of ID(Back)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Picture of Yourself',text:"Upload a picture for yourself holding a paper and write on it. ”LendChain Certification”and the date."},
                       ],
                       'Passport':[
                           {title:'Passport(Cover)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Passport (Personal page)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Picture of Yourself',text:"Upload a picture for yourself holding a paper and write on it. ”LendChain Certification”and the date."},
                       ]
                   },
                    'en':{
                       'ID':[
                           {title:'Picture of ID(Front)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Picture of ID(Back)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Picture of Yourself',text:"Upload a picture for yourself holding a paper and write on it. ”LendChain Certification”and the date."},
                       ],
                       'Passport':[
                           {title:'Passport(Cover)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Passport (Personal page)',text:"Please keep the identity information in the photo displayed intact, the font is clearly visible and the brightness is even."},
                           {title:'Picture of Yourself',text:"Upload a picture for yourself holding a paper and write on it. ”LendChain Certification”and the date."},
                       ]
                   }
                },
                upimgurl:Posturl
            }
        },
    mounted(){
            this.$axios.get(`/trade/user/profile`).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
            });
    },
    mounted(){
       if (document.querySelectorAll('.country-list')[0])document.querySelectorAll('.country-list')[0].style.display="none";
    document.querySelector('.borrowline .vdp-datepicker input').setAttribute('readonly','')
    },
    computed:{
        f_pickerValue:function(){
             return this.customFormatter(this.defaultDate)
        }
    },
    methods:{
        goBack:function(){
            if(this.picsshow){
               this.picsshow=false
            }else{
                this.$router.go(-1)
            }
            
        },
        selecteddate:function(date){
            this.defaultDate=date
            return (date.getFullYear()+'.'+(date.getMonth() + 1)+'.'+date.getDate())
        },
        customFormatter(date) {
            return (date.getFullYear()+'.'+(date.getMonth() + 1)+'.'+date.getDate())
        },
        confirm(boo){
            if(boo){
                if(!!this.idnumber&&!!this.name){
                this.picsshow=true;
                this.bgimgs=[]
                this.picarr=[]
                }else{
                    this.$toast('You must enter your name and ID number')
                    return;
                }
            }else{
                 //提交下面的数据，如果成功，回到认证页面，如果失败跳转到第一个页面重新输入
                // this.picsshow==false;
                if(this.isuping){
                    this.$toast('Image uploading, please wait')
                    return false
                }else if(this.picarr.length<3){
                    this.$toast('Please refer to the tips for uploading your KYC photos.')
                    return;
                }
            let data= {countryCode:this.countrynum,  
                country:this.countryCode,
                name:this.name,
                birthday:this.f_pickerValue,
                type:(this.idselectval=='ID'?1:2),
                idNumber:this.idnumber,
                frontPic:this.picarr[0],
                backPic:this.picarr[1],
                yourselfPic:this.picarr[2]
                }
                this.$axios.post('/trade/user/kyc', data).then(res => {
                      if(Number(res.code)==2000){
                        this.LEND.localStorage('kyc',1)
                        this.$router.go(-1)
                      }else if(Number(res.code)!=2002){
                          this.$toast(res.message)
                      }
                }); 
            }
        },
        excountry(item){
            this.countryCode=item.code
            this.countrynum=item.dialCode
        },
        handleConfirm(e){
           // console.log(e.getFullYear )
        },
        togglepopupVisible(){
            this.popupVisible=!this.popupVisible;
        },
        onIDChange(picker, values){//
            // console.log(values)
        },
        onValuesChange(picker, values) {//选择的ID类型
            this.idselectval=picker.getValues()[0]
        },
        imagechanged(n){
             if(this.isuping){
                    this.$toast('Image uploading, please wait')
                    return;
                }
            this.isuping=true
            this.nowupuint=n;
            var file =document.querySelector("#uploader"+n+" form input");
            var imgUrl =window.URL.createObjectURL(file.files[0]);
            this.bgimgs[n]=imgUrl
        },
        imageuploading(r){
            // console.log(r)
        },
        imageuploaded(res){//图上传
            setTimeout(()=>{
                // console.log(res.data+'sss',res.data.indexOf('http')>0)
                    if(res.data.indexOf('http')>=0){
                    var parent =document.getElementById('uploader'+this.nowupuint).parentNode;
                    parent.style.backgroundImage='url('+this.bgimgs[this.nowupuint]+')'
                    this.picarr[Number(this.nowupuint)]=res.data
                    this.nowupuint=''
                    this.isuping=false;
                    }
            },3000)   
        },
        errorhandle(err){
            // console.log(err)
            this.nowupuint=''
        }
        
    },
      components: {
       contryCode,VueCoreImageUpload,'vuejs-datepicker':Datepicker
        // 'bindasset': bindasset
    }
}
</script>

<style scoped>
.headerline{height:1.17rem;line-height:1.17rem;border-bottom:1px solid #e6e6e6;font-size:16px;background-color:#fff;margin-bottom:10px;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
.personnal .header_pl>img{height:2.1rem;margin:0 auto;}

.contents .form{background-color:#fff;height:500px;overflow-x: hidden;}
.borrowline{height:1.33rem;line-height: 1.33rem;text-align: left;padding: 0 .4rem;font-size:16px;border-bottom: 1px solid #e6e6e6;}
.borrowline > span:first-child {position:absolute;display:inline-block;width:3rem;font-size: 14px;color: #999;text-align: left;}
.borrowline > span:last-child {float: right;border: 0;padding-right: 34px;-moz-appearance: none;-webkit-appearance: none;color: #262626;
    background: url('../../../../static/images/icon/arrow.png') no-repeat scroll right center transparent;
    border-radius: 4px;
    background-size: 12px;
    background-origin: border-box;}
.borrowline input{display: inline-block;width:100%;text-align:left;margin:0 .4rem 0 2rem;padding-right: 2rem;line-height: 100%;border: 0;}
.picker .picker-toolbar div:first-child{padding: 0 .4rem;border-bottom: 1px solid #e6e6e6 !important;}
.picker-toolbar span:first-child{line-height:40px;color:#509fff;float: left;}
.picker-toolbar span:last-child{line-height:40px;color:#509fff;float: right;}

.pics{padding:.4rem;background-color:#fff;color:#999;font-size:12px;}
.pics>p{font-size:14px;text-align:left;color:#262626;}
.pics .pic{margin:.4rem 0;text-align:left;}
.pics .picarea{display:inline-block;width:4.6rem;height:3.2rem;background-position: center center;border-radius: 8px;border: medium #509fff solid;
background:url('../../../../static/images/personnal/module6/i1.png');background-position: center;background-size:contain;background-repeat: no-repeat;}
.pics .pic:nth-child(3)  .picarea{background-image:url('../../../../static/images/personnal/module6/i2.png')}
.pics .pic:nth-child(4)  .picarea{background-image:url('../../../../static/images/personnal/module6/i3.png')}
.isid .pic:nth-child(2)  .picarea{background-image:url('../../../../static/images/personnal/module6/p1.png')}
.isid .pic:nth-child(3)  .picarea{background-image:url('../../../../static/images/personnal/module6/p2.png')}
.isid .pic:nth-child(4)  .picarea{background-image:url('../../../../static/images/personnal/module6/p3.png')}
.pics .textarea{display:inline-block;width:4rem;margin-left:.4rem;}

.pics .g-core-image-upload-btn{margin-top: 20%;text-align:center;}
.pics .g-core-image-upload-btn img{width:50px;}
.confirmbtn{
    line-height: 1.33rem;
    height: 1.33rem;
    margin: .27rem .4rem 2rem .4rem;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
    box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
}
</style>
<style scoped>
 .countrycode{width:7.6rem;padding-right:.4rem;height: 1.3rem;line-height: 1.3rem;font-size: 14px;margin-top:10px;background-color: #fff;text-align:left;margin-left:2rem;}
#kycinput .countrycode .intl-tel-input.allow-dropdown .flag-container{display:inline-block;width:7.4rem !important;}
#kycinput .countrycode .intl-tel-input.allow-dropdown .selected-flag,#kycinput .countrycode .intl-tel-input.separate-dial-code .selected-flag{width:7.4rem !important;padding:0 !important;margin:0 !important;left:0 !important;}
#kycinput .intl-tel-input .selected-flag .iti-flag,#kycinput .countrycode .intl-tel-input .selected-flag .iti-text{left:0;}
#kycinput .countrycode .intl-tel-input .selected-flag .iti-arrow{position: absolute;width:12px;height:initial;right: .2rem;}
#kycinput .countrycode .intl-tel-input .selected-flag .iti-text{width: 6.2rem;overflow-x: hidden;text-overflow: ellipsis;white-space: nowrap;}
#kycinput .countrycode .country-list{width:100%;max-height:400px;}
</style>
<style>
.vdp-datepicker{text-align:right !important;}
.borrowline .vdp-datepicker input{width:6.4rem;height:1rem;font-size:100%;border:0;text-align:right;}
.vdp-datepicker__calendar{right:0;}
</style>


