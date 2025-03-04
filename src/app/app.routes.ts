import { Routes } from '@angular/router';
import { SidenavComponent } from './components/navigation/sidenav/sidenav.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CharacterCounterComponent } from './components/pages/character-counter/character-counter.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'character-counter', component: CharacterCounterComponent },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
