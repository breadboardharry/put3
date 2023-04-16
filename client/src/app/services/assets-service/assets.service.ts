import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { assets } from 'src/app/data/assets';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private apiUrl = environment.serverUrl + environment.apiPath;

  constructor(private http: HttpClient) { }

  public getFlattenSounds(): string[] {
    const dir = assets['sounds'];
    return this.flattenObject(dir);
  }

  public flattenObject(obj: any, path: string = '') {
    let result: any[] = [];

    for (let key in obj) {
      let newPath = path ? path + '/' + key : key;

      if (Array.isArray(obj[key])) {
        result = result.concat(obj[key].map((item: any) => newPath + '/' + item));
      }
      else if (typeof obj[key] === 'object') {
        result = result.concat(this.flattenObject(obj[key], newPath));
      }
    }
    return result;
  }

  /**
   * Get server hosted images data
   * @returns {Promise<any[]>} Image data array
   */
  public getServerImages(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.http.get<any[]>(this.apiUrl + '/images', {
        responseType: 'json'
      }).subscribe((data: any[]) => resolve(data));
    });
  }
}
