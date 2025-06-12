import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-search',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './custom-search.component.html',
  styleUrl: './custom-search.component.scss',
})
export class CustomSearchComponent implements AfterViewInit {
  public searchLabel = input<string>('Search countries...');
  public searchQuery = output<string>();

  public searchValue = new FormControl<string>('');
  public inputEl = viewChild<ElementRef<HTMLInputElement>>('input');

  ngAfterViewInit(): void {
    this.inputEl()?.nativeElement.focus();
  }

  public onInput(): void {
    this.searchQuery.emit(this.searchValue.value!);
  }
}
