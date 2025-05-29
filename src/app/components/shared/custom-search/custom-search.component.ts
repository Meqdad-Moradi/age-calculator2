import { Component, input, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-search',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './custom-search.component.html',
  styleUrl: './custom-search.component.scss',
})
export class CustomSearchComponent {
  public searchLabel = input<string>('Search countries...');
  public searchQuery = output<string>();

  public searchValue = new FormControl<string>('');

  public onInput(): void {
    this.searchQuery.emit(this.searchValue.value!);
  }
}
