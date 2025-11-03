import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pampers } from '../../components/models/pampers';
import { ErrorResponse } from '../../components/models/error-response.model';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root',
})
export class ApiPampersService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly baseUrl = 'http://localhost:3000/pampers';

  /**
   * getPampers
   * @returns Observable<Pampers[] | ErrorResponse<string>>
   */
  public getPampers(): Observable<Pampers[] | ErrorResponse<string>> {
    return this.http.get<Pampers[]>(this.baseUrl).pipe(
      catchError(
        this.errorService.handleError<Pampers[]>(
          'api-pampers.service::getTasks',
          {
            showInDialog: true,
          },
        ),
      ),
    );
  }

  /**
   * addNewItem
   * @param pampers Pampers
   * @returns Observable<Pampers | ErrorResponse<string>>
   */
  public addNewItem(
    pampers: Pampers,
  ): Observable<Pampers | ErrorResponse<string>> {
    return this.http.post<Pampers>(this.baseUrl, pampers).pipe(
      catchError(
        this.errorService.handleError<Pampers>(
          'api-pampers.service::addNewItem',
          {
            showInDialog: true,
          },
        ),
      ),
    );
  }

  /**
   *
   * @param id string -> item id
   * @returns Observable<Pampers | ErrorResponse<string>>
   */
  public deleteItem(id: string): Observable<Pampers | ErrorResponse<string>> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Pampers>(url).pipe(
      catchError(
        this.errorService.handleError<Pampers>(
          'api-pampers.service::deleteItem',
          {
            showInDialog: true,
          },
        ),
      ),
    );
  }

  /**
   * updateItem
   * @param pampers Pampers
   * @returns Observable<Pampers | ErrorResponse<string>>
   */
  public updateItem(
    pampers: Pampers,
  ): Observable<Pampers | ErrorResponse<string>> {
    const url = `${this.baseUrl}/${pampers.id}`;
    return this.http.put<Pampers>(url, pampers).pipe(
      catchError(
        this.errorService.handleError<Pampers>(
          'api-pampers.service::updateItem',
          {
            showInDialog: true,
          },
        ),
      ),
    );
  }
}
