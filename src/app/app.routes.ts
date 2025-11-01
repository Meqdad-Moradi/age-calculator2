import { Routes } from '@angular/router';
import { SidenavComponent } from './components/navigation/sidenav/sidenav.component';
import { CharacterCounterComponent } from './components/pages/character-counter/character-counter.component';
import { CountriesComponent } from './components/pages/countries/countries.component';
import { CountryComponent } from './components/pages/countries/country/country.component';
import { HomeComponent } from './components/pages/home/home.component';
import { PhoneComponent } from './components/pages/phone/phone/phone.component';
import { TaskManagerComponent } from './components/pages/task-manager/task-manager.component';
import { TasksComponent } from './components/pages/task-manager/tasks/tasks.component';
import { TodosComponent } from './components/pages/todos/todos.component';
import { SearchRegionComponent } from './components/pages/search-region/search-region.component';
import { CalculationComponent } from './components/pages/calculation/calculation.component';

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
        component: TaskManagerComponent,
      },
      {
        path: 'task-manager/:id',
        component: TasksComponent,
        pathMatch: 'full',
      },
      { path: 'todos', component: TodosComponent, pathMatch: 'full' },
      { path: 'phone', component: PhoneComponent, pathMatch: 'full' },
      {
        path: 'search-region',
        component: SearchRegionComponent,
        pathMatch: 'full',
      },
      { path: 'pampers', component: CalculationComponent, pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
