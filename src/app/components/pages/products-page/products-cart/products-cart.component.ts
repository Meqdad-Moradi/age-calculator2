import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ProductCartItemComponent } from './product-cart-item/product-cart-item.component';

@Component({
  selector: 'app-products-cart',
  imports: [ProductCartItemComponent, MatAnchor, RouterLink, CurrencyPipe],
  templateUrl: './products-cart.component.html',
  styleUrl: './products-cart.component.scss',
})
export class ProductsCartComponent {
  private readonly apiProductsService = inject(ApiProductsService);

  public cart = this.apiProductsService.cart;

  /**
   * totalPrice
   * A computed property that calculates the total price of all items in the cart.
   */
  public totalPrice = computed(() =>
    this.cart().reduce(
      (acc, item) => (!item ? acc : acc + item.price * item.quantity),
      0,
    ),
  );

  /**
   * checkout
   * A placeholder method for handling the checkout process.
   */
  public checkout(): void {
    console.log('Checking out...');
  }
}
