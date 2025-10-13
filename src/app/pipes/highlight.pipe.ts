import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, searchQuery: string): string {
    if (!value || !searchQuery?.trim()) {
      return value;
    }

    try {
      // Escape regex special characters in the search query
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');

      // // Split around the first parenthesis if present
      // const splitIndex = value.indexOf('(');
      // let mainText = value;
      // let suffix = '';

      // if (splitIndex !== -1) {
      //   mainText = value.substring(0, splitIndex).trimEnd();
      //   suffix = value.substring(splitIndex);
      // }

      // Highlight matches in the main text
      return value.replace(
        regex,
        '<span class="font-semibold text-green-700 dark:text-green-300">$1</span>',
      );
    } catch {
      // Fallback in case of regex issues
      return value;
    }
  }
}
