import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiPampersService } from '../../../services/api/api-pampers.service';
import { ErrorResponse } from '../../models/error-response.model';
import { Pampers } from '../../models/pampers';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { CalculationItemComponent } from './calculation-item/calculation-item.component';
import { CurrencyPipe } from '@angular/common';
import { AddPampersComponent } from './add-pampers/add-pampers.component';

@Component({
  selector: 'app-calculation',
  imports: [
    SectionTitleComponent,
    MatButtonModule,
    MatIconModule,
    CalculationItemComponent,
    CurrencyPipe,
    AddPampersComponent,
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
      .reduce((acc, item) => acc + +item.price * item.quantity, 0)
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

      this.pampers.set(response);
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
}
