import { SharedService } from './../../../shared/src/lib/shared.service';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-plugin-2',
  templateUrl: './plugin2.component.html'
})
export class Plugin2Component {

  @Output()
  public test: EventEmitter<string> = new EventEmitter<string>();

  constructor(private sharedService: SharedService) {}

  handleClick() {
    this.sharedService.sendMessage('plugin1');
    this.test.emit('plugin1');
  }
}
