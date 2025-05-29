import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { ApiTasksService } from '../../../../services/api/api-tasks.service';
import { AddTaskDialogComponent } from '../../../dialogs/add-task-dialog/add-task-dialog.component';
import { TasksGroup } from '../../../models/task-manager';
import { TaskComponent } from '../task/task.component';
import { ErrorService } from '../../../../services/error.service';

@Component({
  selector: 'app-tasks',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgClass,
    NgTemplateOutlet,
    TaskComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  private readonly dialog = inject(MatDialog);
  private readonly apiTasksService = inject(ApiTasksService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly errorService = inject(ErrorService);

  public tasksGroup = signal<TasksGroup | null>(null);

  /**
   * getTasks
   */
  public getTasks = toSignal(
    this.activatedRoute.paramMap.pipe(
      map((params) => params.get('id')),
      concatMap((boardId) => this.apiTasksService.getTasks(boardId!)),
      map((data) => {
        const filteredData = {
          todo: data.filter((x) => x.status === 'todo'),
          doing: data.filter((x) => x.status === 'doing'),
          done: data.filter((x) => x.status === 'done'),
        };
        this.tasksGroup.set(filteredData);
        return filteredData;
      })
    ),
    { initialValue: {} as TasksGroup }
  );

  /**
   * addNewTask
   */
  public addNewTask(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent);
    const id = this.activatedRoute.snapshot.params['id'];

    const dialogRefSubscription = dialogRef
      .afterClosed()
      .pipe(
        map((newTask) => {
          if (!newTask) {
            dialogRefSubscription.unsubscribe();
            return;
          }
          return { ...newTask, boardId: id };
        }),
        switchMap((newTask) => this.apiTasksService.createTask(newTask)),
        tap((addedTask) => {
          this.tasksGroup.update((tasks) => {
            switch (addedTask.status) {
              case 'todo':
                tasks?.todo.push(addedTask);
                break;
              case 'doing':
                tasks?.doing.push(addedTask);
                break;
              default:
                tasks?.done.push(addedTask);
                break;
            }
            return tasks;
          });
        })
      )
      .subscribe({
        error: (error) => {
          this.errorService.displayErrorMsg(
            'An error occured. source:: ' + error.message
          );
          dialogRefSubscription.unsubscribe();
        },
        complete: () => dialogRefSubscription.unsubscribe(),
      });
  }
}
