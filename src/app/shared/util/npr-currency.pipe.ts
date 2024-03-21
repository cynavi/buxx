import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'nprCurrency',
  standalone: true
})
export class NprCurrencyPipe implements PipeTransform {

  private readonly currencyPipe = inject(CurrencyPipe);

  transform(value: number): string {
    return this.currencyPipe.transform(value, 'NPR', 'Rs. ', '1.0-3') ?? '';
  }
}