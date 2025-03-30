import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidenavService } from '../../../services/sidenav.service';
import { CreateBoardDialogComponent } from '../../dialogs/create-board-dialog/create-board-dialog.component';
import { HeaderComponent } from '../header/header.component';

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
  private readonly dialog = inject(MatDialog);

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

  public createNewBoard(): void {
    this.dialog.open(CreateBoardDialogComponent);
  }
}
