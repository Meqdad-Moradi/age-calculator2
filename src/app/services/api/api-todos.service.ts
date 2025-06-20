import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  public todosSignal = toSignal(
    this.getTodos().pipe(
      map((values) => (values instanceof ErrorResponse ? [] : values))
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
