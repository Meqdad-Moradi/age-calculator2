import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
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
  public searchTerm = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.initTaskStreams();
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
    return tasks.filter((t) => t.status === status);
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
          this.apiTasksService.createTask(taskWithBoard).pipe(
            catchError((error) => {
              // show error and swallow so stream completes
              this.errorService.displayErrorMsg(error.message);
              return EMPTY;
            })
          )
        ),
        tap(() => this.initTaskStreams())
      )
      .subscribe();
  }
}
