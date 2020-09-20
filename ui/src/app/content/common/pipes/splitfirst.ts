import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'splitfirst'
})
export class SplitFirst implements PipeTransform {
  transform(value: string, separator:string):string {
    let splits = value.split(separator);
    if(splits.length > 1) {
      return splits[0];
    } else {
      return value;
    }
  }
}