import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { filter, switchMap, take } from 'rxjs/operators';
import { ApiPampersService } from '../../../services/api/api-pampers.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorResponse } from '../../models/error-response.model';
import { Pampers } from '../../models/pampers';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';

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
  ],
  templateUrl: './calculation.component.html',
  styleUrl: './calculation.component.scss',
})
export class CalculationComponent implements OnInit {
  private readonly apiPampersService = inject(ApiPampersService);
  private readonly dialog = inject(MatDialog);

  // properties
  public pampers = signal<Pampers[]>([]);
  public isDataLoaded = false;

  /**
   * totalPrice
   */
  public totalPrice = computed(() => {
    return this.pampers()
      .reduce(
        (acc, item) => (!item ? acc : acc + +item.price! * item.quantity!),
        0,
      )
      .toFixed(2);
  });

  /**
   * totalItems
   */
  public totalItems = computed(() => {
    return this.pampers().length;
  });

  ngOnInit(): void {
    this.getPampers();
  }

  /**
   * getPampers
   */
  public getPampers(): void {
    this.apiPampersService.getPampers().subscribe((response) => {
      if (response instanceof ErrorResponse) {
        return;
      }

      const initialValue = {
        id: null,
        name: null,
        date: null,
        quantity: null,
        price: null,
      };

      this.pampers.update(() => [initialValue, ...response.reverse()]);
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

      this.pampers.update((items) => {
        items.splice(1, 0, response);
        return items;
      });
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
}
