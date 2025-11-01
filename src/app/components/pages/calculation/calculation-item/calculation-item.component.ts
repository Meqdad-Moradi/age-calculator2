import { Component, input, viewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Pampers } from '../../../models/pampers';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calculation-item',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './calculation-item.component.html',
  styleUrl: './calculation-item.component.scss',
})
export class CalculationItemComponent {
  public pamper = input<Pampers>();
  public index = input<number>();

  accordion = viewChild.required(MatAccordion);
}
