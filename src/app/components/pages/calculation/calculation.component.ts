import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiPampersService } from '../../../services/api/api-pampers.service';
import { ErrorResponse } from '../../models/error-response.model';
import { Pampers } from '../../models/pampers';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

  public pampers = signal<Pampers[]>([]);
  public isDataLoaded = false;

  public totalPrice = computed(() => {
    return this.pampers()
      .reduce(
        (acc, item) => (!item ? acc : acc + +item.price! * item.quantity!),
        0,
      )
      .toFixed(2);
  });

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

      this.pampers.update(() => [initialValue, ...response]);
    });
  }

  /**
   * addNewItem
   */
  public addNewItem(formValue: Pampers): void {
    const newItem: Pampers = {
      id: crypto.randomUUID(),
      ...formValue,
    };

    this.apiPampersService.addNewItem(newItem).subscribe((response) => {
      if (response instanceof ErrorResponse) {
        return;
      }

      this.pampers.update((items) => [...items, response]);
    });
  }

  public onSubmit(form: NgForm) {
    const value = {
      ...form.value,
      date: new Date(form.controls['date'].value).toISOString(),
    };
    console.log(value);
  }

  /**
   * editItem
   * @param editedItem Pampers
   */
  public editItem(editedItem: Pampers): void {
    this.apiPampersService.editItem(editedItem).subscribe((response) => {
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
    this.apiPampersService.deleteItem(id).subscribe((response) => {
      if (response instanceof ErrorResponse) {
        return;
      }

      this.pampers.update((items) =>
        items.filter((item) => item && item.id !== id),
      );
    });
  }
}
