import { AsyncPipe } from '@angular/common';
import { Component, input, model, OnInit, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-filter-control',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    AsyncPipe,
  ],
  templateUrl: './filter-control.component.html',
  styleUrl: './filter-control.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class FilterControlComponent implements OnInit {
  public filterQuery = model<string>();
  public sortControl = model<string>();
  public itemsCount = input<number | string>();
  // output
  public isAscOutput = output<boolean>();

  public isAsc = true;
  public options = ['All', 'Asia', 'Africa', 'America', 'Europe', 'Oceania'];
  public sortOptions = ['Name', 'Region', 'Capital'];
  public filteredOptions!: Observable<string[]>;
  public searchControl: FormControl = new FormControl('');

  ngOnInit() {
    // search for specific option
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(value || ''))
    );
  }

  /**
   * onSort
   * this method will sort arrays ascending or descending depends on isAsc
   */
  public onSort(): void {
    this.isAsc = !this.isAsc;
    this.isAscOutput.emit(this.isAsc);
  }

  /**
   * filterOptions
   * @param value string
   * @returns string[]
   */
  private filterOptions(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
