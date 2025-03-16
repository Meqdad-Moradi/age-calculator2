import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskManagerSidenav } from '../components/models/task-manager';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly http = inject(HttpClient);

  private readonly taskManagerSidenavUrl = 'http://localhost:3000/navs';
  public isSideNavOpen = signal<boolean>(true);

  public taskManagerSidenav = toSignal(
    this.http.get<TaskManagerSidenav[]>(this.taskManagerSidenavUrl),
    { initialValue: [] }
  );
}
