import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-search',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './custom-search.component.html',
  styleUrl: './custom-search.component.scss',
})
export class CustomSearchComponent implements AfterViewInit {
  public searchLabel = input<string>('Search countries...');
  public searchQuery = model<string>('');

  public inputEl = viewChild<ElementRef<HTMLInputElement>>('input');

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
