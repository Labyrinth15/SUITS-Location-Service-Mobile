import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TSSService {  
  private headers: Headers = new Headers();
  private httpOptions: any;
  private url = "http://localhost:3000";

  constructor(private http: HttpClient) {
    let tkn = localStorage.getItem('token');
    this.httpOptions = {
    };

	  // Attempt to get the stored URL
	  this.url = localStorage.getItem('tssurl');
  }

  connectionTest(): Promise<any> {
    // Make sure we update the URL
    this.url = localStorage.getItem('tssurl');
    return this.http.get(`${this.url}/conntest`).toPromise().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  getUsers(): Promise<any> {
    return this.http.get(`${this.url}/api/users`).toPromise().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  getUserLocation(uid): Promise<any> {
    return this.http.get(`${this.url}/api/locations/user/${uid}`).toPromise().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  sendLocation(data): Promise<any> {
    return this.http.post(`${this.url}/api/locations`, data).toPromise().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  updateLocation(data): Promise<any> {
    return this.http.put(`${this.url}/api/locations/${data.locid}`, data).toPromise().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}