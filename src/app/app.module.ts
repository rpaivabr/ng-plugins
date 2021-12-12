import { SharedService } from './../../projects/shared/src/lib/shared.service';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ClientPluginLoaderService } from './services/plugin-loader/client-plugin-loader.service';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';
import { PluginsConfigProvider } from './services/plugins-config.provider';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    { provide: PluginLoaderService, useClass: ClientPluginLoaderService },
    PluginsConfigProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: (provider: PluginsConfigProvider) => () =>
        provider
          .loadConfig()
          .toPromise()
          .then(config => ((<any>provider).config = config)),
      multi: true,
      deps: [PluginsConfigProvider]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
