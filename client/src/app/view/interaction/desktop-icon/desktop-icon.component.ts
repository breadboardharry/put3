import { Component, Input, OnInit } from '@angular/core';
import { CursorStyle } from 'src/app/enums/cursor-style';
import { CursorService } from 'src/app/services/cursor-service/cursor.service';

@Component({
  selector: 'app-desktop-icon',
  templateUrl: './desktop-icon.component.html',
  styleUrls: ['./desktop-icon.component.scss']
})
export class DesktopIconComponent implements OnInit {

  @Input() hoverEvent: any;
  @Input() clickEvent: any;
  @Input() singleClickEvent: any;
  @Input() doubleClickEvent: any;
  @Input() outsideClickEvent: any;

  hover: boolean = false;
  focus: boolean = false;

  clickTimeout!: any;
  clicking: boolean = false;
  loading: boolean = false;

  constructor(private cursorService: CursorService) { }

  ngOnInit(): void {
    this.hoverEvent.subscribe((hover: boolean) => this.onHover(hover));
    this.clickEvent.subscribe(() => this.onClick());
    this.singleClickEvent.subscribe(() => this.onSingleClick());
    this.doubleClickEvent.subscribe(() => this.onDoubleClick());
    this.outsideClickEvent.subscribe(() => this.onOutsideClick());
  }

  onHover(hover: boolean) {
    this.hover = hover;
  }

  onClick() {
    if(this.focus) return;
    this.focus = true;
    this.clicking = true;
    setTimeout(() => {
      this.clicking = false;
    }, 250);
  }

  onSingleClick() {
    if(this.focus && !this.clicking) this.focus = false;
  }

  onDoubleClick() {
    this.loading = true;
    this.cursorService.setStyle(CursorStyle.Progress, 2000).then(() => {
      this.loading = false;
    });
  }

  onOutsideClick() {
    this.focus = false;
  }
}
