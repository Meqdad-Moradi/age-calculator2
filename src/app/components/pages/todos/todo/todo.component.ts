import { DatePipe, NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Todo } from '../../../models/todos';

@Component({
  selector: 'app-todo',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    DatePipe,
    NgClass,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public todo = input.required<Todo>();
  public complete = output<Todo>();

  /**
   * toggleCompletion
   * Emits the current todo item when the completion status is toggled.
   */
  public toggleCompletion(e: MatCheckboxChange): void {
    const updatedTodo = { ...this.todo(), completed: e.checked };
    this.complete.emit(updatedTodo);
  }
}
