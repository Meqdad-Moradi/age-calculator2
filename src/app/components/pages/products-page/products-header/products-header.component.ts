import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { MatMenuModule } from '@angular/material/menu';

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
export class ProductsHeaderComponent {
  private readonly productsService = inject(ApiProductsService);

  public cart = this.productsService.cart;
  public cartItemsCount = computed(() => this.cart().length);

  /**
   * clearCart
   */
  public clearCart() {
    this.productsService.cart.set([]);
  }
}
