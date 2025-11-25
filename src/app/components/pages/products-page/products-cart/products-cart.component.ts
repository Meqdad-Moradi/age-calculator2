import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ErrorResponse } from '../../../models/error-response.model';
import { CartItem } from '../../../models/products';
import { ProductCartItemComponent } from './product-cart-item/product-cart-item.component';
import { filter, switchMap, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-products-cart',
  imports: [ProductCartItemComponent, MatAnchor, RouterLink, CurrencyPipe],
  templateUrl: './products-cart.component.html',
  styleUrl: './products-cart.component.scss',
})
export class ProductsCartComponent {
  private readonly apiProductsService = inject(ApiProductsService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  public cart = this.apiProductsService.cart;

  public isUpdating = false;

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

  /**
   * onUpdateQuantity
   * @param cartItem CartItem - updated cart item quantity
   */
  public onUpdateQuantity(cartItem: CartItem): void {
    this.isUpdating = true;

    // update cart item in db
    this.apiProductsService
      .updateCartItem(cartItem.id, { quantity: cartItem.quantity })
      .pipe(take(1))
      .subscribe((updatedItem) => {
        this.isUpdating = false;

        if (updatedItem instanceof ErrorResponse) return;

        // update cart signal after item is saved in db
        this.apiProductsService.cart.update((items) =>
          items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        );

        this.displaySnackbar('Your item successfully updated.');
      });
  }

  /**
   * onDelete
   * @param cartItem CartItem
   */
  public onDelete(cartItem: CartItem) {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Delete Cart Item',
          description: 'Do you want to delete this item?',
        },
        width: '450px',
      })
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        switchMap(() => this.apiProductsService.deleteCartItem(cartItem.id)),
      )
      .subscribe((res) => {
        if (res instanceof ErrorResponse) return;

        this.apiProductsService.cart.update((items) =>
          items.filter((item) => item.id !== cartItem.id),
        );

        this.displaySnackbar('Your item successfully deleted.');
      });
  }

  /**
   * displaySnackbar
   * @param msg string
   */
  private displaySnackbar(msg: string): void {
    this.snackbar.open(msg, 'OK', {
      duration: 3000,
    });
  }
}
