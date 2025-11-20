import { Component, input } from '@angular/core';
import { Product } from '../../../models/products';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-product-card',
  imports: [MatButtonModule, CurrencyPipe, MatIcon],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  public product = input<Product>();
}
