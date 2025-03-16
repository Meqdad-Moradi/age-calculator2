import { Routes } from '@angular/router';
import { SidenavComponent } from './components/navigation/sidenav/sidenav.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CharacterCounterComponent } from './components/pages/character-counter/character-counter.component';
import { CountriesComponent } from './components/pages/countries/countries.component';
import { CountryComponent } from './components/pages/countries/country/country.component';
import { TasksComponent } from './components/pages/task-manager/tasks/tasks.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'character-counter',
        pathMatch: 'full',
        component: CharacterCounterComponent,
      },
      {
        path: 'countries',
        pathMatch: 'full',
        component: CountriesComponent,
      },
      {
        path: 'countries/country',
        pathMatch: 'full',
        component: CountryComponent,
      },
      {
        path: 'task-manager',
        pathMatch: 'full',
        component: TasksComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
