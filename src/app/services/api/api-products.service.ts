import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ErrorService } from '../error.service';
import { catchError, Observable } from 'rxjs';
import { Product } from '../../components/models/products';
import { ErrorResponse } from '../../components/models/error-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiProductsService {
  private readonly baseUrl = 'https://fakestoreapi.com/products';
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);

  public products = signal<Product[]>([]);

  /**
   * getAllProducts
   * @returns Observable<Product[] | ErrorResponse<string>>
   */
  public getAllProducts(): Observable<Product[] | ErrorResponse<string>> {
    return this.http
      .get<Product[]>(this.baseUrl)
      .pipe(
        catchError(
          this.errorService.handleError<Product[]>(
            'api-products.service::getAllProducts',
            { showInDialog: true },
          ),
        ),
      );
  }
}
