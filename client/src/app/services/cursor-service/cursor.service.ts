import { Injectable } from '@angular/core';
import { CursorStyle } from 'src/app/enums/cursor-style';

@Injectable({
  providedIn: 'root'
})
export class CursorService {

  private cursorStyle: CursorStyle = CursorStyle.Default
  private timeout: any;

  constructor() { }

  setStyle(style: CursorStyle, timeout: number = 0, nextStyle: CursorStyle = CursorStyle.Default) {
    return new Promise<void>((resolve, reject) => {
      this.cursorStyle = style;
      this.setCSSValue(style);

      if (!timeout) {
        resolve();
        return;
      }

      clearTimeout(timeout);
      this.timeout = setTimeout(() => {
        this.cursorStyle = nextStyle;
        this.setCSSValue(nextStyle);
        resolve();
      }, timeout);
    });
  }

  get style(): CursorStyle {
    return this.cursorStyle;
  }

  // Set the CSS variable used to control the cursor style of page
  setCSSValue(style: CursorStyle) {
    const element = document.querySelector('body') as HTMLElement;
    element.style.setProperty('--cursor-style', style);
  }
}
