import { DatePipe, NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

import {
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Todo } from '../../../models/todos';

@Component({
  selector: 'app-todo',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    DatePipe,
    NgClass,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDragHandle,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public todo = input.required<Todo>();
  public complete = output<Todo>();
  public delete = output<string>();

  /**
   * toggleCompletion
   * Emits the current todo item when the completion status is toggled.
   */
  public toggleCompletion(e: MatCheckboxChange): void {
    const updatedTodo = { ...this.todo(), completed: e.checked };
    this.complete.emit(updatedTodo);
  }

  /**
   * deleteTodo
   * @param id ID of the todo to be deleted.
   */
  public deleteTodo(id: string): void {
    this.delete.emit(id);
  }
}
