import { Component, inject, signal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { Task } from '../../models/task-manager';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  private readonly dialogRef = inject(MatDialogRef<ViewTaskDialogComponent>);
  public task = inject<Task>(MAT_DIALOG_DATA);

  public statusArr = signal(['todo', 'doing', 'done']);
  public statusControl = new FormControl(this.task.status);

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
    if (!this.statusControl.value) return;
    this.task.status = this.statusControl.value;
    this.dialogRef.close(this.task);
  }
}
