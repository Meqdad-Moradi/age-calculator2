import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { MatMenuModule } from '@angular/material/menu';
import { ErrorResponse } from '../../../models/error-response.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-products-header',
  imports: [
    MatIcon,
    MatButtonModule,
    MatBadgeModule,
    RouterLink,
    MatMenuModule,
  ],
  templateUrl: './products-header.component.html',
  styleUrl: './products-header.component.scss',
})
export class ProductsHeaderComponent implements OnInit {
  private readonly productsService = inject(ApiProductsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public cart = this.productsService.cart;
  public cartItemsCount = computed(() => this.cart().length);
  public isClearCartButtonVisible = this.router.url.includes('/cart');

  ngOnInit(): void {
    this.fetchCartItems();
    this.checkUrl();
  }

  /**
   * fetchCartItems
   */
  private fetchCartItems() {
    this.productsService
      .getCartItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response instanceof ErrorResponse) {
          return;
        }

        this.productsService.cart.set(response.reverse());
      });
  }

  /**
   * checkUrl
   */
  private checkUrl(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isClearCartButtonVisible = e.url.includes('/cart');
      });
  }

  /**
   * clearCart
   */
  public clearCart() {
    this.productsService.cart.set([]);
  }
}
