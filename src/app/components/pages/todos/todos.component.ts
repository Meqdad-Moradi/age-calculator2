import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ApiTodosService } from '../../../services/api/api-todos.service';
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
    NothingFoundComponent,
    TodoComponent,
    FilterControlComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent {
  private readonly apiTodosService = inject(ApiTodosService);

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
    const sub = this.apiTodosService.updateTodo(todoParam).subscribe({
      complete: () => sub.unsubscribe(),
    });
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
}
