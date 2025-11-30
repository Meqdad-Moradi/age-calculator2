import { Component, inject, OnInit, signal } from '@angular/core';
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
import { FilterControlComponent } from '../../../shared/filter-control/filter-control.component';
import { CustomSearchComponent } from '../../../shared/custom-search/custom-search.component';

@Component({
  selector: 'app-products',
  imports: [
    MatProgressSpinnerModule,
    ProductCardComponent,
    FilterControlComponent,
    CustomSearchComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);

  public products = this.apiProductsService.products;
  public filteredProducts = signal<Product[]>([]);
  public isLoading = false;
  public filterOptions = [
    'All',
    "Men's clothing",
    'Jewelery',
    'Electronics',
    "Women's clothing",
  ];

  private selectedFilterOption = '';
  private searchQuery = '';

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
      this.filterProducts();
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
              : [result, ...cart];
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

  /**
   * applyFilters
   * apply filters based on selected category and search query
   */
  private applyFilters(): void {
    const products = this.products();
    const filter = this.selectedFilterOption?.toLocaleLowerCase() || 'all';
    const search =
      this.searchQuery?.toLocaleLowerCase().trim().split(' ') || '';

    this.filteredProducts.set(
      products.filter((item) => {
        const matchesCategory =
          filter === 'all' || item.category.toLocaleLowerCase() === filter;
        const matchesSearch =
          !search ||
          search.every((x) => item.title.toLocaleLowerCase().includes(x));

        return matchesCategory && matchesSearch;
      }),
    );
  }

  /**
   * Filter products by category
   * @param filterQuery string
   */
  public filterProducts(filterQuery = 'All'): void {
    this.selectedFilterOption = filterQuery;
    this.applyFilters();
  }

  /**
   * Search products by query
   * @param searchQuery string
   */
  public searchProducts(searchQuery: string): void {
    this.searchQuery = searchQuery;
    this.applyFilters();
  }
}
