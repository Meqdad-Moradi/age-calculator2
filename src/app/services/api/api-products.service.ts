import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ErrorService } from '../error.service';
import { catchError, Observable } from 'rxjs';
import { CartItem, Product } from '../../components/models/products';
import { ErrorResponse } from '../../components/models/error-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiProductsService {
  private readonly productUrl = 'http://localhost:3000/products';
  private readonly cartUrl = 'http://localhost:3000/cart';
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);

  public products = signal<Product[]>([]);
  public cart = signal<CartItem[]>([]);

  /**
   * getAllProducts
   * @returns Observable<Product[] | ErrorResponse<string>>
   */
  public getAllProducts(): Observable<Product[] | ErrorResponse<string>> {
    return this.http
      .get<Product[]>(this.productUrl)
      .pipe(
        catchError(
          this.errorService.handleError<Product[]>(
            'api-products.service::getAllProducts',
            { showInDialog: true },
          ),
        ),
      );
  }

  /**
   * getCartItems
   * @returns Observable<CartItem[] | ErrorResponse<string>>
   */
  public getCartItems(): Observable<CartItem[] | ErrorResponse<string>> {
    return this.http
      .get<CartItem[]>(this.cartUrl)
      .pipe(
        catchError(
          this.errorService.handleError<CartItem[]>(
            'api-products.service::getCartItems',
            { showInDialog: true },
          ),
        ),
      );
  }

  /**
   * addToCart
   * @param product Product
   * @returns Observable<Product | ErrorResponse<string>>
   */
  public addToCart(
    product: CartItem,
  ): Observable<CartItem | ErrorResponse<string>> {
    return this.http
      .post<CartItem>(this.cartUrl, product)
      .pipe(
        catchError(
          this.errorService.handleError<CartItem>(
            'api-products.service::addToCart',
            { showInDialog: true },
          ),
        ),
      );
  }

  /**
   * updateCartItem
   * @param product CartItem
   * @returns Observable<Product | ErrorResponse<string>>
   */
  public updateCartItem(
    id: number,
    changes: Partial<CartItem>,
  ): Observable<CartItem | ErrorResponse<string>> {
    const url = `${this.cartUrl}/${id}`;
    return this.http
      .patch<CartItem>(url, changes)
      .pipe(
        catchError(
          this.errorService.handleError<CartItem>(
            'api-products.service::updateCartItem',
            { showInDialog: true },
          ),
        ),
      );
  }

  /**
   * deleteCartItem
   */
  public deleteCartItem(
    id: string,
  ): Observable<CartItem | ErrorResponse<string>> {
    return this.http
      .delete<CartItem>(`${this.cartUrl}/${id}`)
      .pipe(
        catchError(
          this.errorService.handleError<CartItem>(
            'api-products.service::deleteCartItem',
            { showInDialog: true },
          ),
        ),
      );
  }
}
