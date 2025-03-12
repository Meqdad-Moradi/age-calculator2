import { Component, inject, signal } from '@angular/core';
import { ApiCountriesService } from '../../../services/api/api-countries.service';
import { CountryCardComponent } from '../../shared/country-card/country-card.component';
import { FilterControlComponent } from '../../shared/filter-control/filter-control.component';

@Component({
  selector: 'app-countries',
  imports: [FilterControlComponent, CountryCardComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent {
  private readonly apiCountriesService = inject(ApiCountriesService);

  public countriesSignal = this.apiCountriesService.countries;
  public searchQuery = signal('');

  public onSearchQueryChange(value: string): void {
    console.log(value);
  }
}
