import { Component, input } from '@angular/core';
import { Product } from '../../../models/products';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-product-card',
  imports: [MatButtonModule, CurrencyPipe, MatIcon, NgClass, MatTooltip],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  public product = input<Product>();

  public isLineClamping = true;

  public toggleLineClamping() {
    this.isLineClamping = !this.isLineClamping;
  }
}
