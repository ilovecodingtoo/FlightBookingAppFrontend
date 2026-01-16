import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SuccessService {
  private content: string = '';
  
  getContent() {
    return this.content;
  }

  setContent(content: string) {
    this.content = content;
    setTimeout(() => this.content = '', 3000);
  }
}
