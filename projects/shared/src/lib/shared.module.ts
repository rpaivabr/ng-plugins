import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponent } from './shared.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SharedComponent, ButtonComponent, TabComponent, TabsComponent],
  exports: [SharedComponent, ButtonComponent, TabComponent, TabsComponent]
})
export class SharedModule {}
