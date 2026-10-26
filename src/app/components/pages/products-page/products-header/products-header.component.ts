import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { MatMenuModule } from '@angular/material/menu';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-products-header',
  imports: [
    MatIcon,
    MatButtonModule,
    MatBadgeModule,
    RouterLink,
    MatMenuModule,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './products-header.component.html',
  styleUrl: './products-header.component.scss',
})
export class ProductsHeaderComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);
  private readonly router = inject(Router);

  public cart = this.apiProductsService.cart;
  public cartItemsCount = computed(() => this.cart().length);
  public isClearCartButtonVisible = this.router.url.includes('/cart');
  // public isCartCleaning = false;

  protected isCartPageOn = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((router) => router.url === '/products-page/cart'),
    ),
    { initialValue: false },
  );

  ngOnInit(): void {
    this.checkUrl();
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
    this.apiProductsService.clearCartSubject.next();
  }
}
