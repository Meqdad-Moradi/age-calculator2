import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ProductCartItemComponent } from './product-cart-item/product-cart-item.component';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorResponse } from '../../../models/error-response.model';

@Component({
  selector: 'app-products-cart',
  imports: [ProductCartItemComponent, MatAnchor, RouterLink, CurrencyPipe],
  templateUrl: './products-cart.component.html',
  styleUrl: './products-cart.component.scss',
})
export class ProductsCartComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);
  private readonly destroyRef = inject(DestroyRef);

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

  ngOnInit(): void {
    this.fetchCartItems();
  }

  /**
   * fetchCartItems
   * Fetches the cart items from the API and updates the cart signal.
   */
  private fetchCartItems(): void {
    this.apiProductsService
      .getCartItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response instanceof ErrorResponse) return;

        this.apiProductsService.cart.set(response);
      });
  }

  /**
   * checkout
   * A placeholder method for handling the checkout process.
   */
  public checkout(): void {
    console.log('Checking out...');
  }
}
