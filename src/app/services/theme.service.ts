
import { inject, Injectable, signal, DOCUMENT } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  public themeIcon = signal<string>('light_mode');
  private themeModeStorekey = 'theme-mode';

  constructor() {
    // initialize the theme dark/light mode
    this.initTheme();
  }

  /**
   * inittheme
   */
  private initTheme(): void {
    const currentMode = this.getStoredThemeMode();
    this.toggleTheme(currentMode);
    this.themeIcon.set(currentMode);
  }

  /**
   * toggleTheme
   * @param mode string
   */
  public toggleTheme(mode: string): void {
    // check if the mode is system
    const isSystemMode = mode === 'system';
    // check if the system prefers dark
    const windowMatchMedia = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    // get the current mode
    const currentMode = isSystemMode
      ? windowMatchMedia
        ? 'dark'
        : 'light'
      : mode;

    // manipulate theme changing logic here
    this.setThemeClassName(currentMode);
    this.storeThemeMode(mode);
  }

  /**
   * setThemeClassName
   * @param mode string
   */
  private setThemeClassName(mode: string): void {
    const classList = this.document.documentElement.classList;
    if (mode === 'light') {
      classList.remove('dark-theme');
    } else {
      classList.add('dark-theme');
    }
  }

  /**
   * storeThemeMode
   * @param mode string
   */
  private storeThemeMode(mode: string): void {
    localStorage.setItem(this.themeModeStorekey, mode);
  }

  /**
   * getStoredThemeMode
   * @returns string -> theme mode
   */
  private getStoredThemeMode(): string {
    return localStorage.getItem(this.themeModeStorekey) || 'system';
  }
}
