import { Routes } from '@angular/router';
import { SidenavComponent } from './components/navigation/sidenav/sidenav.component';
import { HomeComponent } from './components/pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
