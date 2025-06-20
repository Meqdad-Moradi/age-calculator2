import { Component, inject } from '@angular/core';
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
import { Todo } from '../../models/todos';

@Component({
  selector: 'app-add-todo-dialog',
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
  templateUrl: './add-todo-dialog.component.html',
  styleUrl: './add-todo-dialog.component.scss',
})
export class AddTodoDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddTodoDialogComponent>);
  private readonly fb = inject(FormBuilder);

  /**
   * addTodoForm
   */
  public addTodoForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  /**
   * onNoClick
   * This method is called when the user clicks the "Cancel" button in the dialog.
   * It closes the dialog without returning any data.
   * @returns void
   */
  public onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * onSubmit
   * @param e - The event object from the form submission.
   * @returns void
   */
  public onSubmit(e: Event): void {
    e.preventDefault();
    if (this.addTodoForm.invalid) return;

    const { title, description } = this.addTodoForm.value;
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title!,
      description: description!,
      completed: false,
      dueDate: new Date().toISOString(),
    };

    this.dialogRef.close(todo);
    this.addTodoForm.reset();
  }
}
