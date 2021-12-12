import { SharedService } from './../../projects/shared/src/lib/shared.service';
import { Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef, TemplateRef, AfterViewInit, HostListener } from '@angular/core';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';
import { first, fromEvent, interval, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('plugins') plugins!: ElementRef;
  @ViewChild('targetRef', { read: ViewContainerRef, static: true })
  vcRef!: ViewContainerRef;
  sharedService!: SharedService;
  message$!: Observable<string>;

  @HostListener('window:test', ['$event'])
  onTest(e: string) {
    this.sendMessage('olá');
  }

  constructor(
    private injector: Injector,
    private pluginLoader: PluginLoaderService,
    private cfr: ComponentFactoryResolver,
    private vcf: ViewContainerRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.loadPlugin('plugin1');
    // this.message$ = this.sharedService.message$;
  }

  sendMessage(text: string) {
    const plugin1 = this.plugins.nativeElement.children[0];
    plugin1.text = text;
  }

  loadPlugin(pluginName: string) {
    this.pluginLoader.load(pluginName).then((moduleType: any) => {
      const entry = moduleType.entry;
      console.log(moduleType);
      // this.sharedService = moduleType.injector.get(SharedService);
      const componentFactory = this.cfr.resolveComponentFactory(entry);
      this.vcRef.createComponent(componentFactory, undefined, this.injector);
      // this.plugins.nativeElement.children[0].addEventListener('message', (e: any) => console.log(e));
      const plugin1 = this.plugins.nativeElement.children[0];
    });
  }
}
