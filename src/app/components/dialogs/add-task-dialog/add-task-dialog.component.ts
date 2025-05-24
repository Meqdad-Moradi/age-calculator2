import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-task-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule,
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly fb = inject(FormBuilder);

  public addTaskForm = this.fb.group({
    title: ['', [Validators.required]],
    desc: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });

  public statusArr = signal(['todo', 'doing', 'done']);

  /**
   * onSubmit
   * @param e Event
   * @returns void
   */
  public onSubmit(e: Event): void {
    e.preventDefault();
    if (this.addTaskForm.invalid || !this.addTaskForm.value) return;

    const id = crypto.randomUUID();
    const value = this.addTaskForm.value;
    const newTask = { id, ...value };
    this.dialogRef.close(newTask);
    this.addTaskForm.reset();
  }

  /**
   * onNoClick
   */
  public onNoClick(): void {
    this.dialogRef.close();
  }
}
