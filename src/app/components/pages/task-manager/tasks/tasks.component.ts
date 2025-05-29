import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
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
import { Task, TasksGroup, TaskStatus } from '../../../models/task-manager';
import { CustomSearchComponent } from '../../../shared/custom-search/custom-search.component';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-tasks',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgClass,
    NgTemplateOutlet,
    TaskComponent,
    AsyncPipe,
    CustomSearchComponent,
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
  public filteredTasks$!: Observable<TasksGroup>;
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
        this.apiTasksService
          .getTasks(boardId)
          .pipe(map((tasks) => this.groupTasksByStatus(tasks)))
      ),
      // replay the latest grouped result to any new subscribers
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.filteredTasks$ = this.tasksGroup$;
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
    return tasks.filter((t) => t.status === status);
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

  /**
   * onSearchTask
   * @param value string
   */
  public onSearchTask(value: string): void {
    const searchValue = value.toLocaleLowerCase();

    this.tasksGroup$ = of(searchValue).pipe(
      concatMap((value) =>
        this.filteredTasks$.pipe(
          map((tasks) => {
            const todo = tasks.todo.filter((x) =>
              x.title.toLocaleLowerCase().includes(value)
            );
            const doing = tasks.doing.filter((x) =>
              x.title.toLocaleLowerCase().includes(value)
            );
            const done = tasks.done.filter((x) =>
              x.title.toLocaleLowerCase().includes(value)
            );

            return { todo, doing, done };
          })
        )
      )
    );
  }
}
