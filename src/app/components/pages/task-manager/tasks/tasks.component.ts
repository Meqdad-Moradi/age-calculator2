import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SectionTitleComponent } from '../../../shared/section-title/section-title.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../../../dialogs/add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-tasks',
  imports: [
    MatButtonModule,
    SectionTitleComponent,
    NgClass,
    NgTemplateOutlet,
    TaskComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  private readonly dialog = inject(MatDialog);

  public addNewTask(): void {
    this.dialog.open(AddTaskDialogComponent);
  }
}
