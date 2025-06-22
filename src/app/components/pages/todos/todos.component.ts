import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { forkJoin } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiTodosService } from '../../../services/api/api-todos.service';
import { AddTodoDialogComponent } from '../../dialogs/add-todo-dialog/add-todo-dialog.component';
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
    MatMenuModule,
    MatIconModule,
    CustomSearchComponent,
    NothingFoundComponent,
    TodoComponent,
    FilterControlComponent,
    CdkDropList,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent {
  private readonly apiTodosService = inject(ApiTodosService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public accordion = viewChild.required(MatAccordion);
  public todos = this.apiTodosService.todos;

  public searchQuery = signal('');
  public filterQuery = signal('All');
  public filterOptions = ['All', 'Completed', 'Pending'];

  /**
   * todosSignal
   * This computed signal filters the todos based on the search query and filter criteria.
   * It returns an array of todos that match the search query and filter criteria.
   * If there are no todos, it returns an empty array.
   * If the search query is empty and the filter is set to 'All', it returns all todos.
   * If the search query is not empty, it filters todos based on whether their title includes all search terms
   * and whether they match the filter criteria (completed or pending).
   * @returns Todo[] - Filtered array of todos based on search and filter criteria.
   */
  public todosSignal = computed(() => {
    const searchLower = this.searchQuery()
      .trim()
      .toLocaleLowerCase()
      .split(' ');
    const filterLower =
      this.filterQuery() === 'All'
        ? ''
        : this.filterQuery().toLocaleLowerCase();

    // if there are no todos, return an empty array
    if (!this.todos()) {
      return [];
    }
    // if search is empty and filter is 'All', return all todos
    if (searchLower.length === 0 && filterLower === '') {
      return this.todos();
    }
    // filter todos based on search and filter criteria
    return this.todos()?.filter((todo) => {
      const titleLower = todo.title.toLocaleLowerCase();
      const completed = todo.completed ? 'completed' : 'pending';
      const matchesSearch = searchLower.every((sl) => titleLower.includes(sl));
      const matchesFilter =
        filterLower === '' || completed.includes(filterLower);

      return matchesSearch && matchesFilter;
    });
  });

  /**
   * handleCountTodos
   * This computed signal returns a string indicating the number of todos left.
   */
  public handleCountTodos = computed(() => {
    const todos = this.todos();
    const length = ('0' + this.todos().length).slice(-2);
    return todos.length > 0 ? `${length} | items left` : 0;
  });

  /**
   * updateTodo
   * @param todoParam Todo item to be updated
   */
  public updateTodo(todoParam: Todo): void {
    // if the todo is not provided, return early
    if (!todoParam) {
      return;
    }
    // toggle the completed status of the todo
    this.apiTodosService.todos.update((todos) =>
      todos.map((t) =>
        t.id === todoParam.id ? { ...t, completed: todoParam.completed } : t
      )
    );
    // update todo in the API
    this.apiTodosService
      .updateTodo(todoParam)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * onSort
   * This method will sort the todos in reverse order
   */
  public onSort(): void {
    this.todosSignal().reverse();
  }

  /**
   * onSearch
   * @param value string
   */
  public onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  /**
   * addNewTodo
   * This method opens a dialog to add a new todo.
   */
  public addNewTodo(): void {
    this.dialog
      .open(AddTodoDialogComponent)
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((todo) => !!todo),
        switchMap((todo) => this.apiTodosService.addTodo(todo)),
        tap((todo) => {
          if (!todo || todo instanceof Error) return;
          this.apiTodosService.todos.update((todos) => [...todos, todo]);
        })
      )
      .subscribe();
  }

  /**
   * deleteTodo
   * @param id ID of the todo to be deleted.
   * @returns void
   */
  public deleteTodo(id: string): void {
    // if the id is not provided, return early
    if (!id) {
      return;
    }
    // remove the todo from the local todos array
    this.apiTodosService.todos.update((todos) =>
      todos.filter((todo) => todo.id !== id)
    );
    // delete the todo from the API
    this.apiTodosService
      .deleteTodo(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * clearCompleted
   * @returns void
   */
  public clearCompleted(): void {
    // get all completed todos from the local todos array
    const todos = this.todosSignal();
    const completedIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    // if there are no completed todos, return early
    if (!completedIds.length) return;

    // filter out completed todos from the local todos array
    this.apiTodosService.todos.update((todos) =>
      todos.filter((todo) => !todo.completed)
    );

    // Fire off all delete calls in parallel, subscribe once
    const deleteRequests = completedIds.map((id) =>
      this.apiTodosService.deleteTodo(id)
    );

    forkJoin(deleteRequests)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => void 0)
      )
      .subscribe();
  }

  /**
   * drop
   * @param event CdkDragDrop<string[]>
   * This method handles the drop event for dragging and dropping todos.
   * It updates the order of todos in the local todos array based on the drag-and-drop operation.
   */
  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.todosSignal(),
      event.previousIndex,
      event.currentIndex
    );
  }
}
