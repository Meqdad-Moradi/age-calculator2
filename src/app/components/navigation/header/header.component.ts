import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { SwitchThemeComponent } from '../../switch-theme/switch-theme.component';
import { SidenavService } from '../../../services/sidenav.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    SwitchThemeComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly sideNavService = inject(SidenavService);

  public title = signal<string>('Age Calculator');
  public isSideNaveOpen = true;

  /**
   * toggleSideNav
   */
  public toggleSideNav(): void {
    this.isSideNaveOpen = !this.isSideNaveOpen;
    this.sideNavService.isSideNavOpen.set(this.isSideNaveOpen);
  }
}
