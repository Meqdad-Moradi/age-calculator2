import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);

  public isSideNavOpen = signal<boolean>(true);

  /**
   * getSysName
   *  retrieves the x-forwarded-for property from the response header
   * @returns Observable<string | ErrorResponse>
   */
  public getSysName(): Observable<string | null> {
    return this.http
      .get('/', { observe: 'response', responseType: 'text' })
      .pipe(
        map((resp) => resp.headers.get('x-forwarded-for')),
        this.errorService.handleError('health.service::getSysName')
      );
  }
}
