import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { ApiBoardService } from '../../../services/api/api-board.service';
import { ErrorService } from '../../../services/error.service';
import { SidenavService } from '../../../services/sidenav.service';
import { CreateBoardDialogComponent } from '../../dialogs/create-board-dialog/create-board-dialog.component';
import { Board } from '../../models/task-manager';
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
  private readonly apiBoardService = inject(ApiBoardService);
  private readonly errorService = inject(ErrorService);
  private readonly dialog = inject(MatDialog);

  private subscriptions: Subscription[] = [];

  public isSideNavOpen = this.sideNavService.isSideNavOpen;
  public drawerMode: MatDrawerMode = 'side';
  public taskManagerSidenav = this.sideNavService.taskManagerSidenav;
  public isExpanded = false;

  /**
   * onExpandTaskManager
   * @param value boolean
   * @returns void
   */
  public onExpandTaskManager(value = true): void {
    if (!value) {
      this.isExpanded = value;
      return;
    }

    this.isExpanded = !this.isExpanded;
  }

  /**
   * createNewBoard
   */
  public createNewBoard(): void {
    const dialog = this.dialog.open(CreateBoardDialogComponent);

    this.subscriptions.push(dialog.afterClosed().pipe(
      map(value => {
        if (!value) {
          this.subscriptions.forEach(sub => sub.unsubscribe());
          return
        }

        const id = crypto.randomUUID();
        const newBoard: Board = { id, name: value }
        return newBoard
      }),
      concatMap(value => this.apiBoardService.createNewBoard(value!)),
      tap(value => this.taskManagerSidenav().push(value)),
      catchError(error => {
        const msg = error.message;
        throw this.errorService.displayErrorMsg(msg);
      })
    ).subscribe());
  }
}
