import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SharedService {
  messageSubject = new BehaviorSubject<string>('');
  message$ = this.messageSubject.asObservable();

  sendMessage(text: string) {
    this.messageSubject.next(text);
  }
}
