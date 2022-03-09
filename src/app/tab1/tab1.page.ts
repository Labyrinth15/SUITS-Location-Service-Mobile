import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { TSSService } from '../services/tss.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [ TSSService ]
})
export class Tab1Page implements OnInit {

  public debugmsg = "";
  public positionMsg = "";
  public coords: any = {};

  // Interval Vars
  public intervalOptions = [ 5, 10, 30, 60 ]; // limit intervals to 5, 10, 30, 60
  public interval = 5; 
  public isLocked = false;
  public lockInterval: any;
  public intervalTick = 0;

  public hasServerLoc;
  public locPayload: any = {};

  public connInterval: any;
  public isOnline = false;
  public connErrorSent = false;

  public tssUser;

  constructor(private toastController: ToastController, 
    private alertController: AlertController,
    private tssService: TSSService) { }

  /*************** LIFECYCLE HOOKS ***************/
  ngOnInit(): void {
    try {
      this.tssUser = JSON.parse(localStorage.getItem('tssuser'));
      this.getUserLoc();
    } catch(ex) {
      this.presentNoUserAlert();
    }
    this.testConnection();
    this.getLocation(); // Get the location on startup
    // Check connection every 2 seconds
    this.connInterval = setInterval(() => {
      this.testConnection();
    }, 2000);
  }

  ngOnDestroy(): void {
    // this.isLocked = false;
    // clearInterval(this.lockInterval);
    // clearInterval(this.connInterval);
  }

  ionViewWillEnter(): void {
    this.ngOnInit();
  }

  /*************** INTERACTIVE EVENTS ***************/
  toggleLockClick() {
    this.isLocked = !this.isLocked;
    console.log(this.isLocked);
    this.toggleLockInterval();
  }

  toggleLockInterval() {
    if(this.isLocked) {
      this.positionMsg = `Acquisition Lock Enabled - Getting location every ${this.interval} seconds`;
      this.presentLocationToast();
      this.lockInterval = setInterval(() => {
        this.getLocation();
        this.intervalTick++;
      }, this.interval * 1000);
    } else {
      clearInterval(this.lockInterval);
      this.intervalTick = 0;
    }
  }

  /*************** LOCATION EVENTS ***************/
  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    }).then(res => {
      console.log(`Location Collected`);
      this.coords = res.coords;
      this.positionMsg = "Your location has been acquired.";

      if(this.isOnline && this.tssUser) {

        this.locPayload['user'] = this.tssUser.id;
        this.locPayload['room'] = this.tssUser.room;
        this.locPayload['latitude'] = this.coords.latitude;
        this.locPayload['longitude'] = this.coords.longitude;
        this.locPayload['altitude'] = this.coords.altitude;

        // console.log(this.hasServerLoc);
        if(this.hasServerLoc) {
          // Update
          this.updateUserLoc();
        } else if(this.hasServerLoc === undefined || this.hasServerLoc === false) {
          // Create
          this.createUserLoc();
        }
      }

    }).catch(ex => {
      this.positionMsg = "There was an error getting your location.";
      this.presentErrorToast("There was an error getting your location.");
      return;
    });

    if(!this.isLocked) {
      this.presentLocationToast();
    }
  }

  /*************** DATA EVENTS ***************/
  testConnection() {
    this.tssService.connectionTest().then( res => {
      if(res.error) {
        console.log('Connection not made');
        this.isOnline = false;
        if(!this.connErrorSent) {
          this.presentErrorToast('Cannot reach server with current URL.');
          this.connErrorSent = true;
        }
      } else {
        if(res.ok)
        this.isOnline = true;
          this.getUsers();
      }
    });
  }

  getUsers() {
    this.tssService.getUsers().then( res => {
      if(res.error) {
        this.presentErrorToast('Cannot get users.');
      } else {
          // console.log(res);
      }
    });
  }

  getUserLoc() {
    this.tssService.getUserLocation(this.tssUser.id).then(res => {
      if(res.length === 0) {
        this.hasServerLoc = false;
      } else {
        this.locPayload.locid = res[0].id;
        this.hasServerLoc = true;
      }
    }).catch(err => {

    });
  }

  createUserLoc() {
    this.tssService.sendLocation(this.locPayload).then(res => {
      this.locPayload.id = res.id;
    })
  }

  updateUserLoc() {
    this.tssService.updateLocation(this.locPayload).then(res => {
    })
  }

  /************* NOTIFICATIONS *************/
  async presentLocationToast() {
    const toast = await this.toastController.create({
      message: this.positionMsg,
      duration: 2000,
      icon: 'information-circle',
      color: 'primary'
    });
    toast.present();
  }

  async presentErrorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      icon: 'warning-outline',
      color: 'warning'
    });
    toast.present();
  }

  async presentNoUserAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'No TSS User',
      message: 'A TSS user has not been detected. All locations are purely for local view.',
      buttons: ['I Understand']
    });

    await alert.present();
  }
}
