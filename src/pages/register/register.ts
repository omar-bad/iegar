import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import * as $ from 'jquery'
import { AngularFireAuth } from '@angular/fire/auth';
import { TabsPage } from '../tabs/tabs';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public load : LoadingController,public auth : AngularFireAuth,
    public toast : ToastController,public alert : AlertController,
    public db : AngularFireDatabase,private googlePlus: GooglePlus,private fb: Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  ngOnInit(){
    var winh = $(window).height();
    var navh = $(".tabs-md .tab-button").innerHeight();
    $(".father").height(winh);


      $("#username").on('change keyup',function(){
      $(this).val($(this).val().toLowerCase());
  })

      $("#username").on("paste",function(e){
        e.preventDefault();
      })

  }


  viewLogin(){
    $(".signupView").slideUp(100,function(){
      $(".loginView").slideDown(100);
    });
  }

  viewSignup(){
    $(".loginView").slideUp(100,function(){
      $(".signupView").slideDown(100);
    });
  }

  showalert(message){
    var alert = this.alert.create({
      subTitle:message,
      cssClass:"setdire",
      buttons:["حسنا"]
    });
    return alert.present();
  }


  
  login(email,pass){

    if(email.length > 0 && pass.length > 0) {
  
    var load = this.load.create({
    content:"جاري تسجيل الدخول",
    cssClass:"loaddire"

    });
  
    load.present();
  
    this.auth.auth.signInWithEmailAndPassword(email,pass).then( ()=> {
  
      load.dismiss();
    
      if(!this.auth.auth.currentUser.emailVerified){
        $("input").val("");
        var toast = this.alert.create({
          subTitle:"قم بتفعيل الايميل الخاص بك",
          buttons:["حسنا"]
        });
        toast.present();
      }
  
      if(this.auth.auth.currentUser.emailVerified){
      
        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.goToRoot;
      
      }
  
    }).catch( err=> {
      load.dismiss();
      if(err.message == "The password is invalid or the user does not have a password."){
        this.showalert("كلمة مرور غير صحيحة")
      }

      if(err.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
        this.showalert("بريد الكتروني غير موجود")
      }

      if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
        this.showalert("يرجى التحقق من الاتصال بلشبكة")
      }

  
    })
  
    }
  
    }
  
    // register
  
    register(email,name:any,pass){
  
      
    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4];

  
      if(email.length > 0 && pass.length > 0 && name.length > 0) {
  
  
        var load = this.load.create({
          content:"جاري انشاء الحساب",
          cssClass:"loaddire"
          });
        
          load.present();
  
          
        var db = this.db.list("users",ref => ref.orderByChild("name").equalTo(name.toLowerCase())).snapshotChanges();
        var sub = db.subscribe(userche => {
  
        if(userche[0] == undefined){
  
          this.auth.auth.createUserWithEmailAndPassword(email,pass).then( ()=> {
  
            $("input").val("");
  
            
  
            console.log(name);
    
            this.db.list("users").push({
              email:email,
              name:name,
              image:"https://firebasestorage.googleapis.com/v0/b/vote-b1894.appspot.com/o/11906329_960233084022564_1448528159_a.jpg?alt=media&token=dd943fc8-1538-4ad5-88dd-a4db29fa069d",
              verified:false,
              id:rand
            })
    
          load.dismiss();
    
            var user = this.auth.auth.currentUser;
            user.sendEmailVerification().then( ()=> {
              var toast = this.alert.create({
                subTitle:"تم ارسال رابط التفعيل",
                buttons:["حسنا"],
                cssClass:"setdire"
              });
              toast.present();
            });
    
    }).catch( err=> {
      load.dismiss();
      if(err.message == "The email address is badly formatted."){
        this.showalert("بريد الكتروني غير صالح")
      }

      if(err.message == "The email address is already in use by another account."){
       this.showalert("بريد الكتروني مستخدم")
      }

      if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
        this.showalert("يرجى التحقق من الاتصال بلشبكة")
      }

    if(err.message == "Password should be at least 6 characters"){
      this.showalert("كلمة مرور قصيرة");
    }
    })
  
    sub.unsubscribe();
  
        }
  
        if(userche[0] != undefined){
          load.dismiss();
          var toast = this.alert.create({
            subTitle :"اسم المستخدم محجوز",
            buttons:["ok"],
            cssClass:"setdire"
          });
          toast.present();
        }
  
        sub.unsubscribe();
  
        });
  
  
  
  }
  
    }
  
  
    shoEye(){
      $("#showpass").hide();
      $("#hidepass").show();
      $("#password").attr("type","text");
    }

    hideEye(){
      $("#hidepass").hide();
      $("#showpass").show();
      $("#password").attr("type","password");
    }

    shoEyeTwo(){
      $("#showpassTwo").hide();
      $("#hidepassTwo").show();
      $("#passwordTwo").attr("type","text");
    }

    hideEyeTwo(){
      $("#hidepassTwo").hide();
      $("#showpassTwo").show();
      $("#passwordTwo").attr("type","password");
    }


    
  singUpGoogle(){

    var load = this.load.create({
      content:"جاري المعالجة",
      cssClass:"loaddire"
    });

    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
        var rand1 = Math.floor(Math.random() * char.length);
        var rand2 = Math.floor(Math.random() * char.length);
        var rand3 = Math.floor(Math.random() * char.length);
        var rand4 = Math.floor(Math.random() * char.length);
        var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4];

    this.googlePlus.login({
      'webClientId':"1098066924806-8t5e8e5mfagramclrpdqsds836gvtqp7.apps.googleusercontent.com",
      'offline':true
    }).then(res => {

      load.present();

      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(suc => {
        
        load.dismiss();

        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.goToRoot;

        this.db.list("users",ref=>ref.orderByChild("email").equalTo(res.email)).valueChanges().subscribe(usercheck => {
          
          if(usercheck[0] == undefined){

            this.db.list("users").push({
              email:res.email,
              name:res.displayName,
              id:rand,
              verified:false,
              image:res.imageUrl,
            })
          
        }

        })

      }).catch(err => {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      })
    })
  }



  fblogin(){

    var load = this.load.create({
      content:"جاري المعالجة",
      cssClass:"loaddire"
    });

    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4];


   this.fb.login(['email']).then( (res)=> {
    var crend = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    firebase.auth().signInWithCredential(crend).then(info => {

    var load = this.load.create({
      content:"جاري المعالجة",
      cssClass:"loaddire"
    });

    load.present();

    this.db.list("users",ref => ref.orderByChild("email").equalTo(info.email)).valueChanges().subscribe(data => {
      
      if(data[0] == undefined){
        this.db.list("users").push({
          email:info.email,
          name:info.displayName,
          id:rand,
          verified:false,
          image:info.photoURL,
        }).then( ()=> {
          this.navCtrl.setRoot(TabsPage);
          this.navCtrl.goToRoot;
        })
        load.dismiss();

      }

      if(data[0] != undefined){
        load.dismiss();
        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.goToRoot;
      }

     
      

    })

    })

   })

  }



}
