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
  public readonly task = inject<Task>(MAT_DIALOG_DATA);

  public readonly statusArr = ['todo', 'doing', 'done'];
  public statusControl = new FormControl<TaskStatus>(this.task.status, {
    nonNullable: true,
  });
  public titleControl = new FormControl<string>(this.task.title, {
    nonNullable: true,
  });
  public descControl = new FormControl<string>(this.task.desc, {
    nonNullable: true,
  });

  public isTitleEditing = false;
  public isDescEditing = false;

  public get isDisabled(): boolean {
    return (
      this.statusControl.value === this.task.status &&
      this.titleControl.value === this.task.title &&
      this.descControl.value === this.task.desc
    );
  }

  /**
   * onTitleClick
   */
  public onTitleClick(): void {
    this.isTitleEditing = true;
    this.titleControl.setValue(this.task.title);
    this.onFocus('titleInput');
  }

  /**
   * onDescClick
   */
  public onDescClick(): void {
    this.isDescEditing = true;
    this.descControl.setValue(this.task.desc);
    this.onFocus('descInput');
  }

  private onFocus(elId: string): void {
    setTimeout(() => document.getElementById(elId)?.focus(), 0);
  }

  /**
   * onTitleBlur
   */
  public onBlure(): void {
    this.isTitleEditing = false;
    this.isDescEditing = false;
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
    if (this.isDisabled) return;

    const updatedTask = {
      ...this.task,
      title: this.titleControl.value,
      desc: this.descControl.value,
      status: this.statusControl.value,
    };
    this.dialogRef.close(updatedTask);
  }

  /**
   * onDeleteClic
   */
  public onDeleteClic(): void {
    this.apiTaskService.requestDelete(this.task);
    this.dialogRef.close();
  }
}
