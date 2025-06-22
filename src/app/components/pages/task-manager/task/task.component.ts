import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, input, output } from '@angular/core';
import { Task } from '../../../models/task-manager';

@Component({
  selector: 'app-task',
  imports: [CdkDrag, CdkDragHandle],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  public task = input.required<Task>();
  public updateTask = output<Task>();

  /**
   * onViewTask
   * @param task Task
   */
  public onViewTask(): void {
    this.updateTask.emit(this.task());
  }
}
