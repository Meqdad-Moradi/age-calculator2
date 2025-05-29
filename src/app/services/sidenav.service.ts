import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Board } from '../components/models/task-manager';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);

  private readonly taskManagerSidenavUrl = 'http://localhost:3000/boards';
  public isSideNavOpen = signal<boolean>(true);

  public taskManagerSidenav = toSignal(this.getTaskManagerSidenav(), {
    initialValue: [],
  });

  /**
   * getTaskManagerSidenav
   * @returns Observable<Board[]>
   */
  public getTaskManagerSidenav(): Observable<Board[]> {
    return this.http.get<Board[]>(this.taskManagerSidenavUrl);
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
        map((resp) => resp.headers.get('x-forwarded-for'))
        // catchError(
        //   this.errorService.displayErrorMsg('health.service::getSysName')
        // )
      );
  }
}
