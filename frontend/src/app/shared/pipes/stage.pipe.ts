import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stage'
})
export class StagePipe implements PipeTransform {


  transform(value: string): string {

    console.log('value', value);

    switch (value) {
      case 'prospecting':
        return 'Привлечение клиента';
      case 'offer':
        return 'Предложение';
      case 'negotiation':
        return 'Согласование';
      case 'closed won':
        return 'Закрыто успешно';
      case 'closed loose':
        return 'Закрыто провалом';
      default:
        return '';
    }
  }

}
