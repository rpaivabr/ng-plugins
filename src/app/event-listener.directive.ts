import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: '[eventListener]'
})
export class EventListenerDirective {

  constructor(private elementRef: ElementRef) {}

  private get children() {
    console.log(this.elementRef.nativeElement.children);
    return this.elementRef.nativeElement.children;
  }
}
