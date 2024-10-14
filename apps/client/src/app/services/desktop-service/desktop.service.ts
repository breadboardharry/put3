import { Injectable, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DesktopService {

    public containerRef!: ViewContainerRef;

  constructor(private http: HttpClient) { }

  /**
   * Get desktop background image
   * @returns {Promise<string>} Image as base64
   */
  public getBackground(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get('/desktop/get', {
        responseType: 'blob'
      })
        .subscribe((image: Blob) => {
          // Convert Blob to data URL
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(image);
        });
    });
  }
}
