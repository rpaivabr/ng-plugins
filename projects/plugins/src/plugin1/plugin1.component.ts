import { SharedService } from './../../../shared/src/lib/shared.service';

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-plugin-1',
  templateUrl: './plugin1.component.html'
})
export class Plugin1Component {

  @Output()
  public test: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  public text: string = '';
  x = false;

  constructor(
    private sharedService: SharedService
  ) {}

  handleClick() {
    this.x = !this.x;
    this.sharedService.sendMessage('plugin1');
    window.dispatchEvent(new CustomEvent('test', { detail: 'plugin 1', bubbles: true }))
  }
}
