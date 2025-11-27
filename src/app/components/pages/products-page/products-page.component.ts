import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ProductsHeaderComponent } from './products-header/products-header.component';
import { RouterOutlet } from '@angular/router';
import { ApiProductsService } from '../../../services/api/api-products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorResponse } from '../../models/error-response.model';

@Component({
  selector: 'app-products-page',
  imports: [ProductsHeaderComponent, RouterOutlet],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.fetchCartItems();
  }

  /**
   * fetchCartItems
   */
  private fetchCartItems() {
    this.apiProductsService
      .getCartItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response instanceof ErrorResponse) {
          return;
        }

        this.apiProductsService.cart.set(response.reverse());
      });
  }
}
