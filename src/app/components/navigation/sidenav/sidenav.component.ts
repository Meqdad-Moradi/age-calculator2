import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidenavService } from '../../../services/sidenav.service';
import { HeaderComponent } from '../header/header.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    HeaderComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private readonly sideNavService = inject(SidenavService);

  public isSideNavOpen = this.sideNavService.isSideNavOpen;
  public drawerMode: MatDrawerMode = 'side';
  public taskManagerSidenav = this.sideNavService.taskManagerSidenav;
  public isExpanded = false;

  public onExpandTaskManager(value = true): void {
    if (!value) {
      this.isExpanded = value;
      return;
    }

    this.isExpanded = !this.isExpanded;
  }
}
