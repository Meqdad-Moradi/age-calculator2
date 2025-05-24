import { Component, input } from '@angular/core';
import { Task } from '../../../models/task-manager';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  public task = input<Task>();
}
