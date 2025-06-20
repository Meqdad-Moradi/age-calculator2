import { Component, computed, inject, signal } from '@angular/core';
import { ApiCountriesService } from '../../../services/api/api-countries.service';
import { CountryCardComponent } from '../../shared/country-card/country-card.component';
import { FilterControlComponent } from '../../shared/filter-control/filter-control.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from '../../models/country';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { compare } from '../../../helpers/utils';
import { CustomSearchComponent } from '../../shared/custom-search/custom-search.component';

@Component({
  selector: 'app-countries',
  imports: [
    FilterControlComponent,
    CountryCardComponent,
    MatProgressSpinnerModule,
    CustomSearchComponent,
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent {
  private readonly apiCountriesService = inject(ApiCountriesService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public countriesSignal = this.apiCountriesService.countries;
  public searchQuery = signal('');
  public filterQuery = signal('All');
  public sortQuery = signal('Name');
  public filterOptions = [
    'All',
    'Asia',
    'Africa',
    'America',
    'Europe',
    'Oceania',
  ];
  public sortOptions = ['Name', 'Region', 'Capital'];

  /**
   * Computed property to filter countries based on search and region filters.
   */
  public countries = computed(() => {
    // Normalize search and filter queries to lower case for case-insensitive comparison.
    const searchQuery = this.searchQuery().toLocaleLowerCase();
    const filterQuery =
      this.filterQuery() === 'All'
        ? ''
        : this.filterQuery().toLocaleLowerCase();

    return this.countriesSignal().filter((item) => {
      // Normalize country names and region for comparison.
      const commonName = item.name.common.toLocaleLowerCase();
      const officialName = item.name.official.toLocaleLowerCase();
      const region = item.region.toLocaleLowerCase();

      // Check if either country name includes the search query.
      const matchesSearch =
        commonName.includes(searchQuery) || officialName.includes(searchQuery);

      // If no filter query is provided, return true if the search matches.
      if (!filterQuery) {
        return matchesSearch;
      }

      // When a filter query exists, ensure that both the search matches and region includes the filter.
      const matchesRegion = region.includes(filterQuery);
      return matchesSearch && matchesRegion;
    });
  });

  /**
   * displayCountry
   * navigate to country page to display single country details
   * @param country Country
   */
  public displayCountryDetails(country: Country): void {
    this.router.navigate(['country'], {
      relativeTo: this.activatedRoute,
      state: country,
    });
  }

  /**
   * sortControlChange
   * sort countries based on sort option
   * @param value string -> sort option
   */
  public sortControlChange(value: string): void {
    const sortOption =
      value === 'Name'
        ? 'name.common'
        : value === 'Capital'
        ? 'capital[0]'
        : value.toLocaleLowerCase();

    this.countries().sort(compare(sortOption, 'asc'));
  }

  /**
   * onSort
   * sort countries asc/desc
   */
  public onSort(): void {
    this.countries().reverse();
  }

  /**
   * onSearch
   * @param value string
   */
  public onSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
