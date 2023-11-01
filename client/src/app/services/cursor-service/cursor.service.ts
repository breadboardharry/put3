import { Injectable } from '@angular/core';
import { EnumCursorStyle } from 'src/app/enums/cursor-style';

@Injectable({
  providedIn: 'root'
})
export class CursorService {

  private cursorStyle: EnumCursorStyle = EnumCursorStyle.Default
  private timeout: any;

  constructor() { }

  setStyle(style: EnumCursorStyle, timeout: number = 0, nextStyle: EnumCursorStyle = EnumCursorStyle.Default) {
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

  get style(): EnumCursorStyle {
    return this.cursorStyle;
  }

  // Set the CSS variable used to control the cursor style of page
  setCSSValue(style: EnumCursorStyle) {
    const element = document.querySelector('body') as HTMLElement;
    element.style.setProperty('--cursor-style', style);
  }
}
