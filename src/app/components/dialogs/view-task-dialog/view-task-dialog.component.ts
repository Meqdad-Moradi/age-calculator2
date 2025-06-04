import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ApiTasksService } from '../../../services/api/api-tasks.service';
import { Task, TaskStatus } from '../../models/task-manager';

@Component({
  selector: 'app-view-task-dialog',
  imports: [
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './view-task-dialog.component.html',
  styleUrl: './view-task-dialog.component.scss',
})
export class ViewTaskDialogComponent {
  private readonly apiTaskService = inject(ApiTasksService);
  private readonly dialogRef = inject(MatDialogRef<ViewTaskDialogComponent>);
  public task = inject<Task>(MAT_DIALOG_DATA);

  public statusArr = ['todo', 'doing', 'done'];
  public statusControl = new FormControl<TaskStatus>(this.task.status);

  public get isDisabled(): boolean {
    return this.statusControl.value === this.task.status;
  }

  /**
   * onCancelClick
   */
  public onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * onOkClick
   */
  public onOkClick(): void {
    if (!this.statusControl.value || this.isDisabled) return;
    this.task.status = this.statusControl.value;
    this.dialogRef.close(this.task);
  }

  /**
   * onDeleteClic
   */
  public onDeleteClic(): void {
    this.apiTaskService.requestDelete(this.task);
    this.dialogRef.close();
  }
}
