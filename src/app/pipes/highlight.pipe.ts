import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, searchQuery: string): string {
    // Return original value if inputs are invalid
    if (!value || !searchQuery?.trim()) {
      return value;
    }

    try {
      // Create a regex that matches the search query, case-insensitive
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      const splitIndex = value.indexOf('(');
      const beforeParenthesis = value[splitIndex - 1];
      const values = value.split(beforeParenthesis);
      const firstPart = values[0].replace(
        regex,
        '<span class="font-semibold text-teal-500">$1</span>',
      );
      return `${firstPart} ${values[1] || ''}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // In case of invalid regex characters in searchQuery
      return value;
    }
  }
}
