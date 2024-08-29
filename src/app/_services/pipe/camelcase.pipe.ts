import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelcase'
})
export class CamelcasePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase());
  }
}