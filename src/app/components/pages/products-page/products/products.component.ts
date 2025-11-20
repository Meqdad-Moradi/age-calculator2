import { Component, inject, OnInit } from '@angular/core';
import { ApiProductsService } from '../../../../services/api/api-products.service';
import { ErrorResponse } from '../../../models/error-response.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-products',
  imports: [MatProgressSpinnerModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly apiProductsService = inject(ApiProductsService);

  public products = this.apiProductsService.products;

  private isLoading = false;

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
      console.log(response);
      this.apiProductsService.products.set(response);
    });
  }
}
