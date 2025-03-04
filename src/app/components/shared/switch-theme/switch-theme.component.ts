import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-switch-theme',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './switch-theme.component.html',
  styleUrl: './switch-theme.component.scss',
})
export class SwitchThemeComponent implements OnInit {
  private themeService = inject(ThemeService);
  public themeIcon = signal<string>('');

  ngOnInit(): void {
    this.setThemeIcon(this.themeService.themeIcon());
  }

  /**
   * toggletheme
   * @param mode string
   */
  public toggleTheme(mode: string): void {
    this.setThemeIcon(mode);
    this.themeService.toggleTheme(mode);
  }

  /**
   * setthemeicon
   * @param mode string
   */
  private setThemeIcon(mode: string): void {
    this.themeIcon.set(mode === 'system' ? 'devices' : mode + '_mode');
  }
}
