import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../components/models/task-manager';

@Injectable({
  providedIn: 'root',
})
export class ApiTasksService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/tasks';

  /**
   * getTasks
   * @returns Observable<Task[]>
   */
  public getTasks(boardId: string): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl + '?boardId=' + boardId);
  }

  /**
   * createTask
   * @param task Task
   * @returns Observable<Task>
   */
  public createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }
}
