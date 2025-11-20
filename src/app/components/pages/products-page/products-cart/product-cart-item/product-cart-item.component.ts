import { Component, input } from '@angular/core';
import { CartItem } from '../../../../models/products';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-cart-item',
  imports: [CurrencyPipe],
  templateUrl: './product-cart-item.component.html',
  styleUrl: './product-cart-item.component.scss',
})
export class ProductCartItemComponent {
  public cartItem = input<CartItem>();
}
