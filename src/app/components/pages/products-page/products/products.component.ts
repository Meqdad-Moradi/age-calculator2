import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorResponse } from '../../../models/error-response.model';
import { CartItem, Product } from '../../../models/products';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products',
  imports: [MatProgressSpinnerModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);

  public products = this.apiProductsService.products;
  public isLoading = false;

  ngOnInit(): void {
    this.getAllProducts();
  }

  /**
   * getAllProducts
   */
  private getAllProducts() {
    this.isLoading = true;
    this.apiProductsService.getAllProducts().subscribe((response) => {
      this.isLoading = false;

      if (response instanceof ErrorResponse) {
        return;
      }

      this.apiProductsService.products.set(response);
    });
  }

  /**
   * addtoProduct
   * fetches the cart items to check if the product is already in the cart.
   * If it is, it opens a confirmation dialog to ask the user if they want to increment the quantity.
   * If the user confirms, it updates the cart item quantity.
   * If the product is not in the cart, it adds the product to the cart with a quantity of 1.
   * @param product Product
   */
  public addToCart(product: Product) {
    this.apiProductsService
      .getCartItems()
      .pipe(
        take(1),
        switchMap((cartItems) => {
          if (cartItems instanceof ErrorResponse) return of(null);

          const foundProduct = cartItems.find((p) => p.id === product.id);

          if (foundProduct) {
            return this.dialog
              .open(ConfirmationDialogComponent, {
                data: {
                  title: 'Product Already in Cart',
                  description: `The product "${product.title}" is already in the cart. Do you want to increment the quantity?`,
                  confirmButtonLabel: 'Yes',
                },
                maxWidth: '450px',
              })
              .afterClosed()
              .pipe(
                switchMap((confirmed) => {
                  if (!confirmed) return of(null);

                  return this.apiProductsService.updateCartItem(
                    foundProduct.id,
                    {
                      quantity: foundProduct.quantity + 1,
                    },
                  );
                }),
              );
          } else {
            const newProduct: CartItem = { ...product, quantity: 1 };
            return this.apiProductsService.addToCart(newProduct);
          }
        }),
        tap((res) => {
          if (!res || res instanceof ErrorResponse) return;

          this.apiProductsService.cart.update((cart) => {
            const result = res as CartItem;
            const exists = cart.some((item) => item.id === result.id);

            return exists
              ? cart.map((item) => (item.id === result.id ? result : item))
              : [...cart, result];
          });

          this.displaySnackbar('Your item added to cart!');
        }),
      )
      .subscribe();
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
