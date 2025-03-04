import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  public isSideNavOpen = signal<boolean>(true);
}
