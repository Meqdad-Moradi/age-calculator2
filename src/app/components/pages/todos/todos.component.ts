import { AsyncPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ApiTodosService } from '../../../services/api/api-todos.service';
import { ErrorResponse } from '../../models/error-response.model';
import { Todo } from '../../models/todos';
import { CustomSearchComponent } from '../../shared/custom-search/custom-search.component';
import { FilterControlComponent } from '../../shared/filter-control/filter-control.component';
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
    FilterControlComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  private readonly apiTodosService = inject(ApiTodosService);
  private desctoryRef = inject(DestroyRef);

  public accordion = viewChild.required(MatAccordion);

  public todos$!: Observable<Todo[]>;
  public searchQuery = signal('');
  public filterQuery = signal('All');
  public filterOptions = ['All', 'Completed', 'Pending'];

  ngOnInit(): void {
    this.getTodos();
  }

  /**
   * getTodos
   * Fetches the list of todos from the API and maps the response to an observable of
   */
  private getTodos(): void {
    this.todos$ = this.apiTodosService.getTodos().pipe(
      map((todos) => (todos instanceof ErrorResponse ? [] : todos)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
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
        })
      )
      .subscribe({
        complete: () => sub.unsubscribe(),
      });
  }

  /**
   * onSort
   * This method will sort the todos in reverse order
   */
  public onSort(): void {
    this.todos$ = this.todos$.pipe(map((todos) => todos.reverse()));
  }

  /**
   * onSearch
   * @param value string
   */
  public onSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
