import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Board } from '../components/models/task-manager';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly http = inject(HttpClient);

  private readonly taskManagerSidenavUrl = 'http://localhost:3000/boards';
  public isSideNavOpen = signal<boolean>(true);

  public taskManagerSidenav = toSignal(this.getTaskManagerSidenav(), { initialValue: [] });

  /**
   * getTaskManagerSidenav
   * @returns Observable<Board[]>
   */
  public getTaskManagerSidenav(): Observable<Board[]> {
    return this.http.get<Board[]>(this.taskManagerSidenavUrl);
  }
}
