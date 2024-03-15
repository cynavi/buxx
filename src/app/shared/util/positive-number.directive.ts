import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[positiveNumberOnly]',
  standalone: true
})
export class PositiveNumberOnlyDirective {

  text!: string;
  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab'];

  constructor(private el: ElementRef) {
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (next.includes('.')) {
      if (this.text == next) {
        event.preventDefault();
      }
      this.text = next;
    }
    if ((next && !String(next).match(this.regex))) {
      event.preventDefault();
    }
  }
}