import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { HomePage } from '../home/home';
import { Geolocation } from '@ionic-native/geolocation';
import { ProfilePage } from '../profile/profile';
import { OneSignal } from '@ionic-native/onesignal';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  mySelectedPhoto;
  loading;
  imageSrc;
  imageArray = []
  uploadImages = [];
  donloadImgs = []; 
  selectValue = "المحافظة"
  typeSelect = "نوع العقد"
  userinfo = {
    name : "",
    email : "",
    profile : "",
    ver : false,
    userid : ""
  }
  lat = 0;
  lng = 0;

  constructor(public navCtrl: NavController,private camera:Camera, public load : LoadingController,
    public db : AngularFireDatabase,public auth : AngularFireAuth,public toast : ToastController,
    public ac : ActionSheetController, public gps : Geolocation,public oneSignal: OneSignal,
    public alert : AlertController,
    platform : Platform,private diagnostic: Diagnostic,private locationAccuracy: LocationAccuracy) {

   auth.authState.subscribe(user => {
     if(user != undefined){
       this.userinfo.email = user.email
       db.list("users",ref => ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data => {
         this.userinfo.name = data[0]['name'];
         this.userinfo.profile = data[0]['image'];
         this.userinfo.ver = data[0]['verified'];
       })
       db.list("ids",ref => ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(daya => {
         this.userinfo.userid = daya[0]['id'];
       })
     }
   })

   platform.ready().then( ()=> {

    let options = {
      timeout: 30000,
      enableHighAccuracy: true
      }
  
     gps.getCurrentPosition(options).then(dir => {
       this.lat = dir.coords.latitude,
       this.lng = dir.coords.longitude
       
     }).catch(err => {
      var m = alert.create({
         subTitle:err.message
       });
       m.present();
     })

   })
   
   this.diagnostic.isLocationEnabled().then(res => {
     if(!res){
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }
      
      });
     }
   })

  }


  
  ngOnInit(){

  }
  
  selectType(){
  var type =  this.ac.create({
      title:"اختر نوع العقد",
      cssClass:"setdire",
      buttons:[
        {text:"ملك",handler: ()=> {
          this.typeSelect = "ملك"
        }}
      , {text:"ايجار",handler: ()=> {
        this.typeSelect = "ايجار"
      }}
    ]
    })
    type.present();
  }

  takePhoto(){
    const options: CameraOptions = {
      targetHeight:720 ,
      targetWidth:720,
      quality:100, 
      destinationType : this.camera.DestinationType.DATA_URL,
      encodingType:this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
    }

    
    this.camera.getPicture(options).then((imageData) =>{
      this.loading = this.load.create({
        content: "جاري اضافة الصورة ",
        cssClass:"loaddire"
         });
  this.loading.present();
    this.mySelectedPhoto = this.dataURLtoBlob('data:image/jpeg;base64,'+imageData);
        this.upload();
            
            },(err)=>{
        alert(JSON.stringify(err));
            });
    
    
    }
    
        
        
    dataURLtoBlob(myURL){
        let binary = atob(myURL.split(',')[1]);
    let array = [];
    for (let i = 0 ; i < binary.length;i++){
        array.push(binary.charCodeAt(i));
    }
        return new Blob([new Uint8Array(array)],{type:'image/jpeg'});
    }    
        
        
    upload(){

      
    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4];

    if(this.mySelectedPhoto){
        var uploadTask = firebase.storage().ref().child('images/'+rand+".jpg");
        var put = uploadTask.put(this.mySelectedPhoto);
        put.then( ()=> {
          this.loading.dismiss();

          uploadTask.getDownloadURL().then(url =>{
            
            this.donloadImgs.push(url);
  
          });

        });

        put.catch(err =>{
          this.loading.dismiss();

          alert(JSON.stringify(err));
        })
  

    }
    }
    
    
    selectprev(){
      const actionSheet = this.ac.create({
        title: 'اختر المحافضة',
        cssClass:"setdire",
        buttons: [
          {text:"بغداد",handler:()=>{this.selectValue = "بغداد"}},
          {text:"أربيل",handler:()=>{this.selectValue = "أربيل"}},
          {text:"لأنبار",handler:()=>{this.selectValue = "لأنبار"}},
          {text:"بابل",handler:()=>{this.selectValue = "بابل"}},
          {text:"البصرة",handler:()=>{this.selectValue = "البصرة"}},
          {text:"حلبجة",handler:()=>{this.selectValue = "حلبجة"}},
          {text:"دهوك",handler:()=>{this.selectValue = "دهوك"}},
          {text:"القادسية",handler:()=>{this.selectValue = "القادسية"}},
          {text:"ديالى",handler:()=>{this.selectValue = "ديالى"}},
          {text:"ذي قار",handler:()=>{this.selectValue = "ذي قار"}},
          {text:"السليمانية",handler:()=>{this.selectValue = "السليمانية"}},
          {text:" صلاح الدين",handler:()=>{this.selectValue = " صلاح الدين"}},
          {text:"كركوك",handler:()=>{this.selectValue = "كركوك"}},
          {text:"كربلاء",handler:()=>{this.selectValue = "كربلاء"}},
          {text:"المثنى",handler:()=>{this.selectValue = "المثنى"}},
          {text:"بغداد",handler:()=>{this.selectValue = "بغداد"}},
          {text:"ميسان",handler:()=>{this.selectValue = "ميسان"}},
          {text:"النجف",handler:()=>{this.selectValue = "النجف"}},
          {text:"نينوى",handler:()=>{this.selectValue = "نينوى"}},
          {text:"واسط",handler:()=>{this.selectValue = "واسط"}},
  
        ]
      });
      actionSheet.present();
    }



 saveData(title,prev,mntka,type,space,storey,roms,price,addr,phone){


  var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
  var rand1 = Math.floor(Math.random() * char.length);
  var rand2 = Math.floor(Math.random() * char.length);
  var rand3 = Math.floor(Math.random() * char.length);
  var rand4 = Math.floor(Math.random() * char.length);
  var rand5 = Math.floor(Math.random() * char.length);
  var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4] + char[rand5];

  var d = new Date();

  const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  

  if(this.donloadImgs[0] != undefined){
    


    if (space > 0 &&  storey > 0 && roms > 0 && phone > 0 && prev != "المحافظة" && type != "نوع العقد"  && title.replace(/\s/g,"") != "" && mntka.replace(/\s/g,"") != "" && addr.replace(/\s/g,"") != ""  && price.replace(/\s/g,"") != ""){

      this.diagnostic.isLocationEnabled().then(res => {
     
    if(res){

   var alert = this.alert.create({
    subTitle:"سيتم ارسال اعلانك للمعاينة",
    cssClass:"setdire",
    message:"سيتم ابلاغك عندما بوافق المسؤال على اعلانك",
    buttons:[{text:"ارسال الاعلان",handler: ()=>{
    
      this.db.list("house").push({
        name:this.userinfo.name,
        pic:this.userinfo.profile,
        email:this.userinfo.email,
        userid:this.userinfo.userid,
        title:title,
        prev:prev,
        mntka:mntka,
        type:type,
        space:space,
        confirm:"no",
        storey:storey,
        roms:roms,
        price:price,
        addr:addr,
        id:rand,
        lat:this.lat,
        lng:this.lng,
        phone:phone,
        verified:this.userinfo.ver,
        images:this.donloadImgs,
        image:this.donloadImgs[0],
        date: monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear()
        }).then( ()=> {
       var toast = this.toast.create({
         message:"تم ارسال الاعلان",
         cssClass:"setdire",
         duration:3000
       })
       toast.present();
       this.navCtrl.setRoot(HomePage);
       this.navCtrl.goToRoot;
       

       this.db.list("ids",ref => ref.orderByChild("email").equalTo("real25130@gmail.com")).valueChanges().subscribe( ids => {
    
        ids.forEach(id => {
    
    
            this.oneSignal.postNotification({
              app_id:"6bb2ae4a-0c5f-4c3c-85b4-1648d4d8929c",
              include_player_ids:[id['id']],
              contents: {
                en: "هناك اعلان ينتضر منك الموافقة عليه"
              },
              headings: {
                en: "اعلان بلانتضار"
              }
            })
    
         
        })
    
      })

        })

    }},"الغاء"]
  })

  alert.present();

    }

    if(!res){
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }
      
      });
    }

   
  })


 }else{
   this.toast.create({
     message:"اكمل الحقول بشكل صحيح",
     cssClass:"setdire",
     duration:3000
   }).present();
 }
 }
}

support(){
  this.navCtrl.push(ProfilePage);
}

}
