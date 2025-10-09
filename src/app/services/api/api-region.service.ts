import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ErrorResponse } from '../../components/models/error-response.model';
import { LandItem } from '../../components/models/land';
import {
  RegionItem,
  SearchRegionResult,
  SearchSuggestionDisplayType,
} from '../../components/models/search-index';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root',
})
export class ApiRegionService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly baseUrl = 'http://localhost:3000/gemeinde';

  public filteredRegions = signal<SearchRegionResult[]>([]);

  private allRegions = signal<LandItem[]>([]);
  private regions = signal<RegionItem[]>([]);

  /**
   * regionsSignal
   * This signal fetches the list of regions from the API and handles errors.
   * It initializes with an empty array if the API call fails.
   * @returns Signal<LandItem[]>
   */
  private regionsSignal = toSignal(
    this.getRegions().pipe(
      map((values) => (values instanceof ErrorResponse ? [] : values)),
      tap((regions) => {
        this.allRegions.set(regions);
        this.flatRegions();
      }),
    ),
    { initialValue: [] as LandItem[] },
  );

  /**
   * getRegions
   * fetches the list of regions from the API.
   * @returns Observable<LandItem[] | ErrorResponse<string>>
   */
  private getRegions(): Observable<LandItem[] | ErrorResponse<string>> {
    if (this.allRegions().length > 0) {
      return of(this.allRegions());
    } else {
      return this.http
        .get<LandItem[]>(this.baseUrl)
        .pipe(
          catchError(
            this.errorService.handleError<LandItem[]>(
              'api-region.service::getRegions',
              { showInDialog: true },
            ),
          ),
        );
    }
  }

  private flatRegions(): void {
    const regionsList: RegionItem[] = [];

    for (const land of this.allRegions()) {
      if (land.land === '...') continue; // skip placeholder
      regionsList.push({
        nummer: land.nummer,
        land: land.land,
        kgName: land.land,
        type: SearchSuggestionDisplayType.Land,
      });
      for (const bezirk of land.bezirke || []) {
        regionsList.push({
          nummer: bezirk.nummer,
          land: land.land,
          kgName: bezirk.bezirk,
          bezirk: bezirk.bezirk,
          type: SearchSuggestionDisplayType.Bezirk,
        });
        for (const gemeinde of bezirk.gemeinden || []) {
          for (const kG of gemeinde.kGs || []) {
            regionsList.push({
              nummer: +kG.kgNummer,
              land: land.land,
              bezirk: bezirk.bezirk,
              gemeinde: kG.name,
              plz: gemeinde.plz,
              kgName: kG.name,
              kgNummer: +kG.kgNummer,
              type: SearchSuggestionDisplayType.KatastralGemeindeName,
            });
          }

          // get all unique plzs
          const plzs = new Set<string>();
          plzs.add(gemeinde.plz);
          for (const ort of gemeinde.ortschaften || []) {
            for (const plz of ort.plzs || []) {
              plzs.add(plz);
            }
          }

          // add all ortschaften / gemeinden with all possible plz
          for (const plz of plzs || []) {
            for (const ort of gemeinde.ortschaften || []) {
              const ortLower = ort.name.toLocaleLowerCase();
              const gemeindeLower = gemeinde.gemeinde.toLocaleLowerCase();

              // add ortschaft with all possible plz only if the name of the ortschaft is different than the name of the gemeinde
              if (ortLower !== gemeindeLower) {
                regionsList.push({
                  nummer: gemeinde.nummer,
                  land: land.land,
                  bezirk: bezirk.bezirk,
                  gemeinde: gemeinde.gemeinde,
                  plz: plz,
                  plzs: Array.from(plzs),
                  okz: ort.okz,
                  ortschaft: ort.name,
                  type: SearchSuggestionDisplayType.Ortschaft,
                  isMainPlz: ort.plzs[0] === plz,
                });
              }
            }
            // add gemeinde with all possible plz
            regionsList.push({
              nummer: gemeinde.nummer,
              land: land.land,
              bezirk: bezirk.bezirk,
              gemeinde: gemeinde.gemeinde,
              kgName: gemeinde.gemeinde,
              plz: plz,
              plzs: Array.from(plzs),
              type: SearchSuggestionDisplayType.Gemeinde,
              isMainPlz: gemeinde.plz === plz,
            });
          }
        }
      }
    }
    this.regions.set(regionsList);
  }

  /**
   * createSearchRegionResult
   * Creates a SearchRegionResult from a RegionItem.
   * @param regionItem RegionItem
   * @returns SearchRegionResult
   */
  private createSearchRegionResult(
    regionItem: RegionItem[],
  ): SearchRegionResult[] {
    return regionItem.map((region) => {
      return {
        land: region.land || '',
        bezirk: region.bezirk || '',
        mainGemeinde: region.gemeinde || '',
        gemeinde: region.gemeinde || '',
        firstLine: region.plz + ' ' + region.gemeinde,
        secondLine: 'Bezirk ' + region.bezirk + ', ' + region.land,
        plz: region.plz || '',
        okz: region.okz,
      };
    });
  }

  /**
   * searchGemeinde
   * Searches for regions by postal code (PLZ) and updates the filteredRegions signal.
   * @param searchQuery string
   */
  public searchGemeinde(searchQuery: string): void {
    if (!searchQuery || searchQuery.length < 3) {
      this.filteredRegions.set([]);
      return;
    }
    // split search query into individual queries
    const searchQueries = searchQuery.trim().split(' ');
    // return if regions are not loaded yet
    if (!this.regions().length) return;

    // filter regions by gemeinde name containing all search queries
    let regions = this.regions().filter(
      (region) =>
        region.type !== SearchSuggestionDisplayType.WeiterePlz &&
        region.type !== SearchSuggestionDisplayType.Ortschaft,
    );

    // if the search query is a number, search for plz, otherwise search for gemeinde name
    if (!isNaN(+searchQuery)) {
      regions = regions.filter((region) =>
        searchQueries.every(
          (query) =>
            region.plz?.startsWith(query.toLowerCase()) ||
            region.nummer === +query ||
            region.kgNummer === +query,
        ),
      );
    } else {
      regions = regions.filter((region) =>
        searchQueries.every((query) =>
          region.gemeinde?.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }

    // sort regions by gemeinde name, prioritizing those that start with the search query
    regions.sort(this.sortByGemeindeName(searchQuery));
    // create SearchRegionResult from filtered regions
    const res = this.createSearchRegionResult(regions);
    console.log(res);

    // set the filtered regions
    this.filteredRegions.set(res);
  }

  /**
   * sortByGemeindeName
   * Sorts GemeindeItem by name, prioritizing those that start with the search query.
   * @param searchQuery string
   * @returns number
   */
  private sortByGemeindeName(searchQuery: string) {
    const query = searchQuery.toLowerCase();

    return (a: RegionItem, b: RegionItem) => {
      // sort those first that start with the query
      if (
        a.gemeinde?.toLowerCase().startsWith(query) ||
        b.gemeinde?.toLowerCase().startsWith(query)
      )
        return -1;
      // just sort alphabetically
      return a.gemeinde?.localeCompare(b.gemeinde || '') || 0;
    };
  }
}
