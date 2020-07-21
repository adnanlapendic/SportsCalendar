import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  constructor() {}

  private messageSource = new BehaviorSubject(true);
  currentMessage = this.messageSource.asObservable();

  changeMessage(shownavbar: boolean) {
    this.messageSource.next(shownavbar);
  }
}
