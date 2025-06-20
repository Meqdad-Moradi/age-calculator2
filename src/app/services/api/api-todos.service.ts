import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ErrorResponse } from '../../components/models/error-response.model';
import { Todo } from '../../components/models/todos';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root',
})
export class ApiTodosService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly baseUrl = 'http://localhost:3000/todos';

  public todos = signal<Todo[]>([]);

  /**
   * todosSignal
   * This signal fetches the list of todos from the API and handles errors.
   * It initializes with an empty array if the API call fails.
   * @returns Signal<Todo[]>
   */
  private todosSignal = toSignal(
    this.getTodos().pipe(
      map((values) => (values instanceof ErrorResponse ? [] : values)),
      tap((todos) => this.todos.set(todos))
    ),
    { initialValue: [] as Todo[] }
  );

  /**
   * getTodos
   * @returns Observable<Todo[] | ErrorResponse<string>>
   */
  private getTodos(): Observable<Todo[] | ErrorResponse<string>> {
    return this.http.get<Todo[]>(this.baseUrl).pipe(
      catchError(
        this.errorService.handleError<Todo[]>('api-todos.service::getTodos', {
          showInDialog: true,
        })
      )
    );
  }

  /**
   * updateTodo
   * @param todo Todo item to be updated
   * @returns Observable<Todo | ErrorResponse<string>>
   */
  public updateTodo(todo: Todo): Observable<Todo | ErrorResponse<string>> {
    return this.http.put<Todo>(`${this.baseUrl}/${todo.id}`, todo).pipe(
      catchError(
        this.errorService.handleError<Todo>('api-todos.service::updateTodo', {
          showInDialog: true,
        })
      )
    );
  }
}
