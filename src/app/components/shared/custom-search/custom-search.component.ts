import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-search',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './custom-search.component.html',
  styleUrl: './custom-search.component.scss',
})
export class CustomSearchComponent implements AfterViewInit {
  public searchLabel = input<string>('Search countries...');
  public searchQuery = output<string>();

  public searchValue = new FormControl<string>('');
  public inputEl = viewChild<ElementRef<HTMLInputElement>>('input');

  // Constants for input validation
  private readonly maxLength = 50; // Prevent buffer overflow attacks
  private readonly inputPattern = /^[a-zA-Z0-9\s-]*$/; // Restrict input characters

  /**
   * After view initialization, focus the input if in secure context
   * Prevents automatic focus in potentially unsafe environments
   */
  ngAfterViewInit(): void {
    if (this.isSecureContext() && this.inputEl()) {
      this.inputEl()?.nativeElement.focus();
    }
  }

  /**
   * Handles input changes with proper validation and sanitization
   * Emits only valid and sanitized values
   */
  public onInput(): void {
    if (!this.searchValue || this.searchValue.value === null) {
      return;
    }

    const sanitizedValue = this.searchValue.value.trim();
    if (this.isValidInput(sanitizedValue)) {
      this.searchQuery.emit(sanitizedValue);
    }
  }

  /**
   * Validates input against security rules
   * @param value The input string to validate
   * @returns boolean indicating if input meets security requirements
   */
  private isValidInput(value: string): boolean {
    return value.length <= this.maxLength && this.inputPattern.test(value);
  }

  /**
   * Checks if the current context is secure
   * Prevents potentially unsafe operations in insecure contexts
   */
  /**
   * Checks if the current context is secure by verifying the window.isSecureContext property.
   * A secure context is required for certain Web APIs and features that require additional
   * security guarantees, such as the Web Crypto API or Service Workers.
   * 
   * The context is considered secure when:
   * - The page is served over HTTPS
   * - The page is served from localhost
   * - The page is loaded from a file:// URL
   * 
   * @returns {boolean} True if the current context is secure, false otherwise
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts}
   * @private
   */
  private isSecureContext(): boolean {
    return window.isSecureContext;
  }
}
