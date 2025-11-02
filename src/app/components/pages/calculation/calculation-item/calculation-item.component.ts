import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Pampers } from '../../../models/pampers';

@Component({
  selector: 'app-calculation-item',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './calculation-item.component.html',
  styleUrl: './calculation-item.component.scss',
})
export class CalculationItemComponent {
  public pamper = input<Pampers>();
  public index = input<number>();

  public editItem = output<Pampers>();
  public deleteItem = output<string>();
}
