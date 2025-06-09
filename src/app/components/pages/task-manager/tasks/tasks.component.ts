import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep, isEqual } from 'lodash';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { ApiBoardService } from '../../../../services/api/api-board.service';
import { ApiTasksService } from '../../../../services/api/api-tasks.service';
import { SidenavService } from '../../../../services/sidenav.service';
import { AddTaskDialogComponent } from '../../../dialogs/add-task-dialog/add-task-dialog.component';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ViewTaskDialogComponent } from '../../../dialogs/view-task-dialog/view-task-dialog.component';
import {
  Board,
  Task,
  TasksGroup,
  TaskStatus,
} from '../../../models/task-manager';
import { CustomSearchComponent } from '../../../shared/custom-search/custom-search.component';
import { NothingFoundComponent } from '../../../shared/nothing-found/nothing-found.component';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-tasks',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NgClass,
    NgTemplateOutlet,
    TaskComponent,
    AsyncPipe,
    CustomSearchComponent,
    NothingFoundComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly apiTasksService = inject(ApiTasksService);
  private readonly apiBoardService = inject(ApiBoardService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly sidenavService = inject(SidenavService);

  public tasksGroup$!: Observable<TasksGroup>;
  public searchTerm = new BehaviorSubject<string>('');

  private deleteSubscription!: Subscription;

  ngOnInit(): void {
    this.initTaskStreams();
    this.onDeleteTask();
  }

  ngOnDestroy(): void {
    this.deleteSubscription.unsubscribe();
  }

  /**
   * initTaskStreams
   * watch route 'id' and fetch tasks, grouping them by status.
   * combine grouped tasks with the current search term.
   * emits updated filtered task groups reactively.
   */
  private initTaskStreams(): void {
    const tasks$ = this.activatedRoute.paramMap.pipe(
      map((params) => params.get('id')!),
      distinctUntilChanged(),
      switchMap((boardId) =>
        this.apiTasksService
          .getTasks(boardId)
          .pipe(map((tasks) => this.groupTasksByStatus(tasks)))
      ),
      // replay the latest grouped result to any new subscribers
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // combine your grouped tasks with the current search term:
    this.tasksGroup$ = combineLatest([tasks$, this.searchTerm]).pipe(
      map(([groups, term]) => ({
        todo: this.filterBySearch(groups.todo, term),
        doing: this.filterBySearch(groups.doing, term),
        done: this.filterBySearch(groups.done, term),
      })),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  /**
   * groupTasksByStatus
   * @param tasks Task[]
   * @returns TaskGroup
   */
  private groupTasksByStatus(tasks: Task[]): TasksGroup {
    return {
      todo: this.filterByStatus(tasks, 'todo'),
      doing: this.filterByStatus(tasks, 'doing'),
      done: this.filterByStatus(tasks, 'done'),
    };
  }

  /**
   * filterByStatus
   * @param tasks Task[]
   * @param status TaskStatus
   * @returns Task[]
   */
  private filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
    return tasks.filter((t) => t.status === status && t.boardId);
  }

  /**
   * fitlerBySearch
   * returns only those tasks whose title or description includes the search term
   * @param tasks Task[]
   * @param term string
   * @returns Task[]
   */
  private filterBySearch(tasks: Task[], term: string): Task[] {
    if (!term) return tasks;

    return tasks.filter((t) => t.title.toLocaleLowerCase().includes(term));
  }

  /**
   * onSearchTask
   * @param searchTerm string
   */
  public onSearchTask(searchTerm: string): void {
    this.searchTerm.next(searchTerm.toLocaleLowerCase());
  }

  /**
   * addNewTask
   */
  public addNewTask(): void {
    const boardId = this.activatedRoute.snapshot.paramMap.get('id');

    this.dialog
      .open(AddTaskDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter((newTask) => !!newTask),
        map((newTask) => ({ ...newTask, boardId })),
        switchMap((taskWithBoard) =>
          this.apiTasksService.createTask(taskWithBoard)
        ),
        tap(() => this.initTaskStreams())
      )
      .subscribe();
  }

  /**
   * onUpdateTask
   * click on this method will show the selected task in a dialog for further action
   * @param task Task
   */
  public onUpdateTask(task: Task): void {
    const originalTask = task;

    this.dialog
      .open(ViewTaskDialogComponent, {
        data: cloneDeep(task),
        maxWidth: 500,
      })
      .afterClosed()
      .pipe(
        take(1),
        filter(
          (updatedTask) => !!updatedTask && !isEqual(updatedTask, originalTask)
        ),
        switchMap((updatedTask) =>
          this.apiTasksService
            .updateTask(updatedTask)
            .pipe(tap(() => this.initTaskStreams()))
        )
      )
      .subscribe();
  }

  /**
   * onDeleteTask
   */
  private onDeleteTask(): void {
    this.deleteSubscription = this.apiTasksService.triggerDeleteTask$
      .pipe(
        filter((task) => !!task),
        concatMap((task) =>
          this.apiTasksService
            .deleteTask(task.id)
            .pipe(tap(() => this.initTaskStreams()))
        )
      )
      .subscribe();
  }

  /**
   * deleteBoard
   * Opens a confirmation dialog, and if the user confirms:
   *   1. Deletes every task on the current board.
   *   2. Deletes the board itself.
   *   3. Refreshes the sidebar’s board list.
   */
  public deleteBoard(): void {
    const dialogRef = this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Delete Current Board',
          description:
            "Deleting the current board will delete all its content. which means all it's tasks will be permanently deleted!",
        },
        maxWidth: 500,
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        concatMap(() => {
          const boardId = this.activatedRoute.snapshot.paramMap.get('id')!;

          // first delete all tasks, then delete the board itself
          return this.apiTasksService
            .deleteTasksByBoardId(boardId)
            .pipe(concatMap(() => this.apiBoardService.deleteBoard(boardId)));
        }),
        // fetch updated list of boards to handle select next board and if there is no board any more,
        // redirect to the task-manager page
        concatMap(() => this.apiBoardService.getBoards()),
        tap((boards: Board[]) => {
          if (boards.length) {
            // get the deleted board index and after delete it will be the index of next board
            const index =
              this.sidenavService.boardIndex() === boards.length
                ? 0
                : this.sidenavService.boardIndex();
            this.router.navigate(['task-manager', boards[index].id]);
          } else {
            this.router.navigate(['task-manager']);
          }
          this.sidenavService.requestGetBoards(true);
        })
      )
      .subscribe({
        complete: () => {
          this.initTaskStreams();
          dialogRef.unsubscribe();
        },
      });
  }
}
