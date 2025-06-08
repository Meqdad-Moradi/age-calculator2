import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Task } from '../../components/models/task-manager';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root',
})
export class ApiTasksService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly baseUrl = 'http://localhost:3000/tasks';

  private triggerDeleteTaskSubject$ = new Subject<Task>();

  public get triggerDeleteTask$(): Observable<Task> {
    return this.triggerDeleteTaskSubject$.asObservable();
  }

  /**
   * requestDelete
   * @param task Task
   */
  public requestDelete(task: Task): void {
    this.triggerDeleteTaskSubject$.next(task);
  }

  /**
   * getTasks
   * @returns Observable<Task[]>
   */
  public getTasks(boardId: string): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl + '?boardId=' + boardId).pipe(
      this.errorService.handleError<Task[]>('api-tasks.service::getTasks', {
        showInDialog: true,
      })
    );
  }

  /**
   * createTask
   * @param task Task
   * @returns Observable<Task>
   */
  public createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      this.errorService.handleError<Task>('api-tasks.service::createTask', {
        showInDialog: true,
      })
    );
  }

  /**
   * updateTask
   * @param task Task
   * @returns Observable<Task>
   */
  public updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(this.baseUrl + '/' + task.id, task).pipe(
      this.errorService.handleError<Task>('api-tasks.service::updateTask', {
        showInDialog: true,
      })
    );
  }

  /**
   * deleteTask
   * @param id string -> task id
   * @returns Observable<Task>
   */
  public deleteTask(id: string): Observable<Task> {
    return this.http.delete<Task>(this.baseUrl + '/' + id).pipe(
      this.errorService.handleError<Task>('api-tasks.service::deleteTask', {
        showInDialog: true,
      })
    );
  }
}
