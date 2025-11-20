import { Component, inject } from '@angular/core';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ProductCartItemComponent } from "./product-cart-item/product-cart-item.component";
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-cart',
  imports: [ProductCartItemComponent, MatAnchor, RouterLink],
  templateUrl: './products-cart.component.html',
  styleUrl: './products-cart.component.scss',
})
export class ProductsCartComponent {
  private readonly apiProductsService = inject(ApiProductsService);

  public cart = this.apiProductsService.cart;
}
