import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { SidenavService } from '../../../services/sidenav.service';
import { SwitchThemeComponent } from '../../shared/switch-theme/switch-theme.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
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

  /**
   * onPrint -> print page
   */
  public onPrint(): void {
    print();
  }
}
