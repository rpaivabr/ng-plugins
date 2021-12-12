import { Injectable, Type } from '@angular/core';
import { PluginLoaderService } from './plugin-loader.service';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';
import { PluginsConfigProvider } from '../plugins-config.provider';
import { SharedService } from 'projects/shared/src/public-api';

const SystemJs = (window as any).System;

@Injectable()
export class ClientPluginLoaderService extends PluginLoaderService {
  constructor(private configProvider: PluginsConfigProvider) {
    super();
  }

  provideExternals() {
    Object.keys(PLUGIN_EXTERNALS_MAP).forEach(externalKey =>
      (window as any).define(
        externalKey,
        [],
        () => (<any>PLUGIN_EXTERNALS_MAP)[externalKey]
      )
    );
  }

  load<T>(pluginName: any): Promise<Type<T>> {
    const { config } = this.configProvider;
    if (!config[pluginName]) {
      throw Error(`Can't find appropriate plugin`);
    }

    const depsPromises = (config[pluginName].deps || []).map(dep => {
      return SystemJs.import(config[dep].path).then((m: any) => {
        (<any>window)['define'](dep, [], () => m.default);
      });
    });

    return Promise.all(depsPromises).then(() => {
      return SystemJs.import(config[pluginName].path)
        .then((module: any) => module.default.default);
    });
  }
}
