import { AsyncPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiTodosService } from '../../../services/api/api-todos.service';
import { ErrorResponse } from '../../models/error-response.model';
import { Todo } from '../../models/todos';
import { CustomSearchComponent } from '../../shared/custom-search/custom-search.component';
import { NothingFoundComponent } from '../../shared/nothing-found/nothing-found.component';
import { TodoComponent } from './todo/todo.component';

@Component({
  selector: 'app-todos',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    CustomSearchComponent,
    AsyncPipe,
    NothingFoundComponent,
    TodoComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  private readonly apiTodosService = inject(ApiTodosService);

  public accordion = viewChild.required(MatAccordion);
  public todos$!: Observable<Todo[]>;

  private desctoryRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getTodos();
  }

  /**
   * getTodos
   * Fetches the list of todos from the API and maps the response to an observable of
   */
  private getTodos(): void {
    this.todos$ = this.apiTodosService
      .getTodos()
      .pipe(map((todos) => (todos instanceof ErrorResponse ? [] : todos)));
  }

  /**
   * updateTodo
   * @param todo Todo item to be updated
   */
  public updateTodo(todo: Todo): void {
    const sub = this.apiTodosService
      .updateTodo(todo)
      .pipe(
        tap((updatedTodo) => {
          if (updatedTodo instanceof ErrorResponse) {
            sub.unsubscribe();
            return;
          }
          this.getTodos();
          sub.unsubscribe();
        })
      )
      .subscribe();
  }
}
