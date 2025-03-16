import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filter-control',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './filter-control.component.html',
  styleUrl: './filter-control.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class FilterControlComponent {
  public searchQuery = model.required<string>();
  public filterQuery = model.required<string>();
  public sortControl = model.required<string>();
  public itemsCount = input.required<number | string>();
  // output
  public isAscOutput = output<boolean>();

  public isAsc = true;

  public filterOptions = [
    'All',
    'Asia',
    'Africa',
    'America',
    'Europe',
    'Oceania',
  ];
  public sortOptions = ['Name', 'Region', 'Capital'];

  /**
   * onSort
   * this method will sort arrays ascending or descending depends on isAsc
   */
  public onSort(): void {
    this.isAsc = !this.isAsc;
    this.isAscOutput.emit(this.isAsc);
  }
}
