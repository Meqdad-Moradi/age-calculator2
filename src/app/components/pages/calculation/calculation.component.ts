import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { filter, switchMap, take } from 'rxjs/operators';
import { compare } from '../../../helpers/utils';
import { ApiPampersService } from '../../../services/api/api-pampers.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorResponse } from '../../models/error-response.model';
import { EnPampersItemType, Pampers, EnTimePeriod } from '../../models/pampers';
import { FilterControlComponent } from '../../shared/filter-control/filter-control.component';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { DateRangeDialogComponent } from '../../dialogs/date-range-dialog/date-range-dialog.component';
import { SelectDateRange } from '../../models/date-range';
import { DownloadService } from '../../../services/download.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-calculation',
  imports: [
    SectionTitleComponent,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe,
    CommonModule,
    FormsModule,
    FilterControlComponent,
    MatSelectModule,
  ],
  templateUrl: './calculation.component.html',
  styleUrl: './calculation.component.scss',
})
export class CalculationComponent implements OnInit {
  private readonly apiPampersService = inject(ApiPampersService);
  private readonly downloadService = inject(DownloadService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // properties
  public pampers = signal<Pampers[]>([]);
  public filteredPampers = signal<Pampers[]>([]);
  public filterOptions: string[] = [
    'All',
    EnPampersItemType.Pamper,
    EnPampersItemType.DastmalTar,
    EnPampersItemType.DastmalKhoshk,
    EnPampersItemType.Shir,
    EnPampersItemType.Other,
    EnTimePeriod.SelectTimePeriod,
  ];
  public sortOptions: string[] = ['Name', 'Type', 'Date'];
  public sortQuery = signal<string>('Name');
  public filterQuery = signal<string>(this.filterOptions[0]);
  public isDataLoaded = false;

  /**
   * totalPrice
   */
  public totalPrice = computed(() => {
    return this.filteredPampers()
      .reduce(
        (acc, item) => (!item ? acc : acc + item.price! * item.quantity!),
        0,
      )
      .toFixed(2);
  });

  /**
   * totalItems
   */
  public totalItems = computed(() => {
    // - 1, because the first item is always empty
    return this.pampers().length - 1;
  });

  ngOnInit(): void {
    this.getPampers();
    this.downloadDataAsJson();
  }

  /**
   * createInitialFormValue
   * @returns Pampers
   */
  private createInitialFormValue(): Pampers {
    return {
      id: null,
      name: null,
      date: null,
      quantity: null,
      price: null,
      type: null,
    };
  }

  /**
   * getPampers
   */
  public getPampers(): void {
    this.apiPampersService.getPampers().subscribe((response) => {
      if (response instanceof ErrorResponse) {
        return;
      }
      // update pampers
      this.pampers.update(() => [
        this.createInitialFormValue(),
        ...response.reverse(),
      ]);
      this.filteredPampers.set(this.pampers());
    });
  }

  /**
   * onSubmit
   * Handles form submission for Pampers items.
   * @param form NgForm - Angular form instance
   * @param item Pampers
   * @returns void
   */
  public onSubmit(form: NgForm, item: Pampers): void {
    if (form.invalid) return;

    const value: Pampers = {
      ...item,
      date: new Date(item.date!).toISOString(),
      id: item.id ?? crypto.randomUUID(),
      price: +item.price!,
    };

    if (item.id) {
      this.updateItem(value);
    } else {
      this.addNewItem(value);
    }

    form.reset();
  }

  /**
   * addNewItem
   */
  public addNewItem(value: Pampers): void {
    this.apiPampersService.addNewItem(value).subscribe((response) => {
      if (response instanceof ErrorResponse) {
        return;
      }

      const pampers = this.pampers();
      pampers.splice(1, 0, response);
      this.pampers.update(() => [...pampers]);
    });
  }

  /**
   * updateItem
   * @param editedItem Pampers
   */
  public updateItem(editedItem: Pampers): void {
    this.apiPampersService.updateItem(editedItem).subscribe((response) => {
      if (response instanceof ErrorResponse) {
        return;
      }

      this.pampers.update((items) =>
        items.map((item) =>
          item && item.id === response.id ? response : item,
        ),
      );
    });
  }

  /**
   * deleteItem
   * @param id string -> item id
   */
  public deleteItem(id: string): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Delete Current Item',
          description: 'Are you sure you want to delete this item?',
        },
        maxWidth: '400px',
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.apiPampersService.deleteItem(id)),
        take(1),
      )
      .subscribe((response) => {
        if (response instanceof ErrorResponse) {
          return;
        }

        this.pampers.update((items) =>
          items.filter((item) => item && item.id !== id),
        );
      });
  }

  /**
   * onSort
   * @param option string - pamper option
   */
  public onSort(option: string): void {
    this.filteredPampers().sort(compare(option.toLocaleLowerCase()));
  }

  /**
   * onSortAscOrDesc
   */
  public onSortAscOrDesc(): void {
    this.reverseArrWithoutFirstElement(this.filteredPampers());
  }

  /**
   * reverseArrWithoutFirstElement
   * @param arr T[]
   */
  private reverseArrWithoutFirstElement<T>(arr: T[]): void {
    let left = 1; // start after the first element
    let right = arr.length - 1; // last element

    while (left < right) {
      // swap elements
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }

  /**
   * onFilter
   * filter out the list based on filter option and also date range
   * @param filterValue string
   * @returns void
   */
  public onFilter(filterValue: string): void {
    if (filterValue !== EnTimePeriod.SelectTimePeriod) {
      // if filter value === all, display all data
      if (filterValue === this.filterOptions[0]) {
        this.filteredPampers.set(this.pampers());
        return;
      }

      // filter the list based on selected filter option
      this.filteredPampers.update(() =>
        this.pampers().filter((item) => item.type === filterValue),
      );
    } else {
      this.dialog
        .open(DateRangeDialogComponent, {
          data: {
            title: 'Choose Date Range',
          },
        })
        .afterClosed()
        .pipe(filter(Boolean), take(1))
        .subscribe((tsp: SelectDateRange) => {
          const fromDate: Date = new Date(tsp.fromDate);
          const toDate: Date = new Date(tsp.toDate);

          this.filteredPampers.update(() =>
            this.pampers().filter(
              (item) =>
                new Date(item.date!) >= fromDate &&
                new Date(item.date!) <= toDate,
            ),
          );
        });
    }
  }

  /**
   * downloadDataAsJson
   */
  private downloadDataAsJson(): void {
    this.downloadService.downloadJson
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.downloadService.downloadDataAsJson(this.pampers());
      });
  }
}
