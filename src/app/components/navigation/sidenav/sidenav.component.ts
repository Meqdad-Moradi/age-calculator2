import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { concatMap, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ApiBoardService } from '../../../services/api/api-board.service';
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
    AsyncPipe,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  private readonly sidenavService = inject(SidenavService);
  private readonly apiBoardService = inject(ApiBoardService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  private subscriptions: Subscription[] = [];

  public isSideNavOpen = this.sidenavService.isSideNavOpen;
  public drawerMode: MatDrawerMode = 'side';
  public boards$!: Observable<Board[]>;
  public isExpanded = false;

  ngOnInit(): void {
    // if a board's page is open, the boards menus should also be expanded
    if (this.isBoardPageOpen()) {
      this.onExpandTaskManager(this.isBoardPageOpen());
    }

    this.getBoards();
  }

  private isBoardPageOpen(): boolean {
    return this.router.url.includes('task-manager/');
  }

  /**
   * getBoards
   */
  private getBoards(): void {
    this.boards$ = this.sidenavService.triggerGetBoard.pipe(
      switchMap(() => this.apiBoardService.getBoards())
    );
  }

  /**
   * sendIndex
   * after click on a board to navigate to task-manger page, we need to understand it's index
   * to determine after delete the current board, select automatically the next board
   * @param index number => board index
   */
  public sendIndex(index: number): void {
    this.sidenavService.boardIndex.set(index);
  }

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
    this.dialog
      .open(CreateBoardDialogComponent, {
        maxWidth: 500,
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((value) => !!value),
        map((value) => {
          if (!value) {
            this.subscriptions.forEach((sub) => sub.unsubscribe());
            return;
          }

          const id = crypto.randomUUID();
          const newBoard: Board = { id, name: value };
          return newBoard;
        }),
        concatMap((value) => this.apiBoardService.createNewBoard(value!)),
        tap(() => this.getBoards())
      )
      .subscribe();
  }

  /**
   * getSystemInfo
   */
  private getSystemInfo(): void {
    this.sidenavService.getSysName().subscribe((value) => {
      console.log(value);
    });
  }
}
