import { Directive, Host } from '@angular/core';
import { NgForOf } from '@angular/common';

@Directive({
  selector: '[ngForTrackById]',
  standalone: true
})
export class NgForTrackByIdDirective<T> {

  constructor(@Host() private ngFor: NgForOf<T>) {
    // @ts-ignore
    this.ngFor.ngForTrackBy = (index: number, item: T) => item.id;
  }
}
