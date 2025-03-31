import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { concatMap, map } from 'rxjs';
import { ApiTasksService } from '../../../../services/api/api-tasks.service';
import { AddTaskDialogComponent } from '../../../dialogs/add-task-dialog/add-task-dialog.component';
import { TasksGroup } from '../../../models/task-manager';
import { TaskComponent } from '../task/task.component';

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

  public tasksGroup = toSignal(this.activatedRoute.paramMap.pipe(
    map(params => params.get('id')),
    concatMap(boardId => this.apiTasksService.getTasks(boardId!)),
    map(data => {
      return {
        todo: data.filter(x => x.state === 'todo'),
        doing: data.filter(x => x.state === 'doing'),
        done: data.filter(x => x.state === 'done')
      }
    })
  ), { initialValue: {} as TasksGroup });

  /**
   * addNewTask
   */
  public addNewTask(): void {
    this.dialog.open(AddTaskDialogComponent);
  }
}
