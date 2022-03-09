import { Component } from '@angular/core';
import { TSSService } from '../services/tss.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [ TSSService ]
})
export class Tab2Page {

  public tssUrl = "";
  public isUrlNew = false;
  public tssUsers = [];
  public selectedUserId: any;
  public selectedUser: any;

  constructor(private tssService: TSSService, private toastController: ToastController) {
    this.tssUrl = localStorage.getItem('tssurl');
    try{
      this.selectedUser = JSON.parse(localStorage.getItem('tssuser'));
    } catch(ex) {
      // Nothing to see here. We must have just started.
    }

    if(!this.tssUrl) {
      this.tssUrl = "http://localhost:8080";
      // Set the local store
      localStorage.setItem('tssurl', this.tssUrl);
    }

    this.testConnection();
  }

  /*************** CHANGE EVENTS ***************/
  urlChanged(e) {
    console.log(`Url Changed To: ${this.tssUrl}`);
    this.isUrlNew = true;
  }

  /*************** INTERACTIVE EVENTS ***************/
  updateUrl() {
    // Let's update the local storage
    localStorage.setItem('tssurl', this.tssUrl);
    // Run a connection test
    this.testConnection();
    // Set isNew to false
    this.isUrlNew = false;
  }

  userChanged(e) {
    this.selectedUser = this.tssUsers.find(x => x.id === parseInt(e));
    localStorage.setItem('tssuser', JSON.stringify(this.selectedUser));
  }

  /*************** DATA EVENTS ***************/
  testConnection() {
    this.tssService.connectionTest().then( res => {
      if(res.error) {
        console.log('Connection not made');
        this.presentErrorToast('Cannot reach server with current URL.');
      } else {
        if(res.ok)
          this.presentSuccessToast('Connected to server');
          this.getUsers();
      }
    });
  }

  getUsers() {
    this.tssService.getUsers().then( res => {
      if(res.error) {
        this.presentErrorToast('Cannot get users.');
      } else {
          console.log(res);
          this.tssUsers = res;
      }
    });
  }

  /*************** NOTIFICATIONS ***************/
  async presentSuccessToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      icon: 'checkmark-circle-outline',
      color: 'success'
    });
    toast.present();
  }
  
  async presentErrorToast(err) {
    const toast = await this.toastController.create({
      message: err,
      duration: 2000,
      icon: 'warning-outline',
      color: 'warning'
    });
    toast.present();
  }

}
