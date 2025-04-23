import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateParser',
  standalone: true
})
export class DateParserPipe implements PipeTransform {
  transform(value: string | Date): Date | null {
    if (!value) return null;
    
    if (value instanceof Date) {
      return value;
    }
    
    try {
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      
      return parsedDate;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  }
}
