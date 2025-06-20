import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ErrorService } from '../error.service';
import { Todo } from '../../components/models/todos';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorResponse } from '../../components/models/error-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiTodosService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly baseUrl = 'http://localhost:3000/todos';

  /**
   * getTodos
   * @returns Observable<Todo[] | ErrorResponse<string>>
   */
  public getTodos(): Observable<Todo[] | ErrorResponse<string>> {
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
