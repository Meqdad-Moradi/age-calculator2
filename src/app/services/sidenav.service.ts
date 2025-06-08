import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);

  private trigerGetBoardSubject = new BehaviorSubject<boolean>(false);

  public isSideNavOpen = signal<boolean>(true);
  
  public get triggerGetBoard(): Observable<boolean> {
    return this.trigerGetBoardSubject.asObservable();
  }

  /**
   * requestGetBoards
   * @param value boolean
   */
  public requestGetBoards(value: boolean): void {
    this.trigerGetBoardSubject.next(value);
  }

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
