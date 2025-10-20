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
      // Split search query into words and remove empty strings
      const searchWords = searchQuery.trim().split(/\s+/);

      // Create a regex pattern that matches any of the search words
      const escapedWords = searchWords.map((word) =>
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      );

      // Join the words with OR operator and make it match word characters
      const pattern = `(${escapedWords.join('|')})`;
      const regex = new RegExp(pattern, 'gi');

      // Highlight matches in the text
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
