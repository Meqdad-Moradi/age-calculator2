import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

  /**
   * deleteTasksByBoardId
   * Deletes all tasks associated with the given board ID.
   *
   * 1. Performs GET /tasks?boardId=<boardId> to retrieve every task
   *    belonging to that board.
   * 2. Maps each returned Task to an individual DELETE /tasks/:id call.
   * 3. Uses forkJoin to run all DELETEs in parallel and wait for completion.
   * 4. Maps the array of void results back to a single void for the caller.
   * 5. Applies centralized error handling.
   *
   * @param boardId The UUID of the board whose tasks should all be removed.
   * @returns An Observable that completes once every matching task has been deleted.
   */
  public deleteTasksByBoardId(boardId: string): Observable<void> {
    return this.getTasks(boardId).pipe(
      // for each task call DELETE /tasks/:id
      mergeMap((tasks) => {
        if (!tasks.length) {
          // nothing to delete → just complete
          return of([]);
        }
        const deletes = tasks.map((t) => this.deleteTask(t.id));
        // forkJoin waits for *all* delete calls to finish
        return forkJoin(deletes);
      }),
      // map the array of voids → void
      map(() => void 0),
      // your existing error‐handler
      this.errorService.handleError<void>(
        'api-tasks.service::deleteTasksByBoardId',
        { showInDialog: true }
      )
    );
  }
}
