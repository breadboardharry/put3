import { Injectable } from '@angular/core';
import { assets } from 'src/app/data/assets';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor() { }

  getFlattenSounds(): string[] {
    const dir = assets['sounds'];
    return this.flattenObject(dir);
  }

  flattenObject(obj: any, path: string = '') {
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
}
