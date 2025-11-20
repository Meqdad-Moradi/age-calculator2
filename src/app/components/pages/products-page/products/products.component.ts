import { Component, inject, OnInit } from '@angular/core';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ErrorResponse } from '../../../models/error-response.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../../models/products';

@Component({
  selector: 'app-products',
  imports: [MatProgressSpinnerModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);

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
   * Adds product to cart
   * @param product Product
   */
  public addToProduct(product: Product) {
    this.apiProductsService.cart.update((cart) => {
      // Check if product already in cart
      const existingProduct = cart.find((p) => p.id === product.id);
      if (existingProduct) {
        // Increase quantity
        existingProduct.quantity += 1;
      } else {
        // Add new product to cart
        cart.push({ ...product, quantity: 1 });
      }
      // Return updated cart
      return [...cart];
    });
  }
}
