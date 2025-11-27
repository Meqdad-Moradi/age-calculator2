import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAnchor } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorResponse } from '../../../models/error-response.model';
import { CartItem } from '../../../models/products';
import { ProductCartItemComponent } from './product-cart-item/product-cart-item.component';

@Component({
  selector: 'app-products-cart',
  imports: [ProductCartItemComponent, MatAnchor, RouterLink, CurrencyPipe],
  templateUrl: './products-cart.component.html',
  styleUrl: './products-cart.component.scss',
})
export class ProductsCartComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

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

  ngOnInit(): void {
    this.clearCartItems();
  }

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

  /**
   * clearCartItems
   */
  private clearCartItems(): void {
    this.apiProductsService.clearCartSubjectObservable
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          this.dialog
            .open(ConfirmationDialogComponent, {
              data: {
                title: 'Delete all cart items',
                description:
                  'By click on delete button, all cart items will be permanently deleted!',
              },
              maxWidth: '450px',
            })
            .afterClosed(),
        ),
        filter(Boolean),
        switchMap(() =>
          forkJoin(
            this.apiProductsService
              .cart()
              .map((item) => this.apiProductsService.deleteCartItem(item.id)),
          ),
        ),
        tap(() => this.apiProductsService.cart.set([])),
      )
      .subscribe({
        error: (err) => console.error('Failed to clear cart', err),
      });
  }
}
