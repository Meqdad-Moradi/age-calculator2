import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { ApiTasksService } from '../../../../services/api/api-tasks.service';
import { ErrorService } from '../../../../services/error.service';
import { AddTaskDialogComponent } from '../../../dialogs/add-task-dialog/add-task-dialog.component';
import { TasksGroup } from '../../../models/task-manager';
import { FilterControlComponent } from '../../../shared/filter-control/filter-control.component';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-tasks',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgClass,
    NgTemplateOutlet,
    TaskComponent,
    FilterControlComponent,
    AsyncPipe,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly apiTasksService = inject(ApiTasksService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly errorService = inject(ErrorService);

  public tasksGroup$!: Observable<TasksGroup>;
  public searchQuery = signal('');

  ngOnInit(): void {
    this.getTasks();
  }

  /**
   * getTasks
   */
  private getTasks(): void {
    this.tasksGroup$ = this.activatedRoute.paramMap.pipe(
      // grab the board ID (non-null asserted because your route always has it)
      map((params) => params.get('id')!),
      // only react when the ID actually changes
      distinctUntilChanged(),
      // cancel previous fetch if a new ID comes in
      switchMap((boardId) =>
        this.apiTasksService.getTasks(boardId).pipe(
          map((tasks) => ({
            todo: tasks.filter((t) => t.status === 'todo'),
            doing: tasks.filter((t) => t.status === 'doing'),
            done: tasks.filter((t) => t.status === 'done'),
          }))
        )
      ),
      // replay the latest grouped result to any new subscribers
      shareReplay({ bufferSize: 1, refCount: true })
    );
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
          this.apiTasksService.createTask(taskWithBoard).pipe(
            catchError((error) => {
              // show error and swallow so stream completes
              this.errorService.displayErrorMsg(error.message);
              return EMPTY;
            })
          )
        ),
        tap(() => this.getTasks())
      )
      .subscribe();
  }

  public onSearch(): void {
    console.log('foo on ssearch');
  }
}
