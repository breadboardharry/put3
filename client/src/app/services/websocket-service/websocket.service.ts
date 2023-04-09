import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: any;
  public data: any;

  constructor() {
    // Connect Socket with server URL
    this.socket = io(environment.apiUrl);

    this.socket.on('notification', (data: any) => {
      this.data = data;
      console.log(data);
    });
  }
}
