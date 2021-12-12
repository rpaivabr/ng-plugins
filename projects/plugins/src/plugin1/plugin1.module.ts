import { SharedModule } from './../../../shared/src/lib/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin1Component } from './plugin1.component';
import { SharedService } from 'projects/shared/src/public-api';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [Plugin1Component],
  providers: [SharedService],
  entryComponents: [Plugin1Component]
})
export class Plugin1Module {
  static entry = Plugin1Component;
}
