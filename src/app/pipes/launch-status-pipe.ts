import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'launchStatus',
  standalone: true
})
export class LaunchStatusPipe implements PipeTransform {
  transform(value: boolean | null | undefined): string {
    if (value === true) {
      return 'Success';
    }

    if (value === false) {
      return 'Failed';
    }

    return 'Unknown';
  }
}
