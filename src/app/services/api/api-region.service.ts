import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../../components/models/error-response.model';
import { LandItem } from '../../components/models/regions';
import {
  EnSearchMode,
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
  public filteredCities = signal<SearchRegionResult[]>([]);
  public filteredZips = signal<SearchRegionResult[]>([]);

  private regions = signal<RegionItem[]>([]);

  /**
   * getRegions
   * fetches the list of regions from the API.
   * @returns Observable<LandItem[] | ErrorResponse<string>>
   */
  public getRegions(): Observable<LandItem[] | ErrorResponse<string>> {
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

  public flatRegions(allRegions: LandItem[]): void {
    // do nothing if regions are empty
    if (!allRegions.length) return;

    const regionsList: RegionItem[] = [];

    for (const land of allRegions) {
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
              nummer: gemeinde.nummer,
              land: land.land,
              bezirk: bezirk.bezirk,
              gemeinde: gemeinde.gemeinde,
              plz: gemeinde.plz,
              kgName: kG.kgName,
              kgNummer: kG.kgNummer,
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
          for (const plz of Array.from(plzs) || []) {
            for (const ort of gemeinde.ortschaften || []) {
              // add ortschaft with all possible plz only if the name of the ortschaft is different than the name of the gemeinde
              if (
                ort.name.toLocaleLowerCase() !==
                gemeinde.gemeinde.toLocaleLowerCase()
              ) {
                regionsList.push({
                  nummer: gemeinde.nummer,
                  land: land.land,
                  bezirk: bezirk.bezirk,
                  gemeinde: gemeinde.gemeinde,
                  plz: plz, // plz,
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
   * getFirstLine
   * Returns the formatted first line of the search suggestion based on the region type.
   * Format varies by type:
   * - Land: [land name]
   * - Bezirk: [bezirk name]
   * - Gemeinde: [PLZ] [gemeinde name]
   * - KatastralGemeindeName: [PLZ] [KG name] KG [KG number] ([gemeinde name])
   * - Ortschaft: [PLZ] [ortschaft name]
   * @param region RegionItem
   * @returns string
   */
  private getFirstLine(
    region: RegionItem,
    searchMode = EnSearchMode.Region,
  ): string {
    const {
      type,
      land = '',
      bezirk = '',
      gemeinde = '',
      kgName = '',
      ortschaft = '',
      plz = '',
      kgNummer = '',
    } = region;

    switch (type) {
      case SearchSuggestionDisplayType.Land:
        return `${land}`;

      case SearchSuggestionDisplayType.Bezirk:
        return `${bezirk}`;

      case SearchSuggestionDisplayType.Gemeinde:
        return searchMode !== EnSearchMode.Ortschaft
          ? plz
            ? `${plz} ${gemeinde}`
            : gemeinde
          : gemeinde;

      case SearchSuggestionDisplayType.KatastralGemeindeName:
        return plz ? `${plz} ${kgName} KG ${kgNummer} (${gemeinde})` : kgName;

      case SearchSuggestionDisplayType.Ortschaft:
        return searchMode !== EnSearchMode.Ortschaft
          ? plz
            ? `${plz} ${ortschaft}`
            : ortschaft
          : ortschaft;

      default:
        return '';
    }
  }

  /**
   * getSecondLine
   * Returns the formatted second line of the search suggestion based on the region type.
   * @param region RegionItem
   * @returns string
   */
  private getSecondLine(
    region: RegionItem,
    searchMode: EnSearchMode = EnSearchMode.Region,
  ): string {
    const { type, land = '', bezirk = '', plzs = [] } = region;
    if (searchMode !== EnSearchMode.Ortschaft) {
      // For Land type
      if (type === SearchSuggestionDisplayType.Land) {
        return `Land ${land}`;
      }

      // For Bezirk type
      if (type === SearchSuggestionDisplayType.Bezirk) {
        return `Bezirk ${bezirk}`;
      }

      // For all other types (Gemeinde, KatastralGemeindeName, Ortschaft)
      // They share the same format: "Bezirk [bezirk], [land]"
      return `Bezirk ${bezirk}, ${land}`;
    } else {
      return plzs.join(', ');
    }
  }

  private getGemeindeName(region: RegionItem): string {
    return region.type === SearchSuggestionDisplayType.Ortschaft
      ? region.ortschaft || ''
      : region.gemeinde || '';
  }

  /**
   * createSearchRegionResult
   * Creates a SearchRegionResult from a RegionItem.
   * @param regionItem RegionItem
   * @returns SearchRegionResult
   */
  private createSearchRegionResult(
    regionItem: RegionItem[],
    searchMode: EnSearchMode = EnSearchMode.Region,
  ): SearchRegionResult[] {
    return regionItem.map((region) => {
      return {
        land: region.land || '',
        bezirk: region.bezirk || '',
        mainGemeinde: region.gemeinde || '',
        gemeinde: this.getGemeindeName(region) || '',
        firstLine: this.getFirstLine(region, searchMode),
        secondLine: this.getSecondLine(region, searchMode),
        plz: region.plz || '',
        okz: region.okz,
      };
    });
  }

  /**
   * filterPlzs
   * Filters regions for plzs (postal codes) by name and updates the filteredRegions signal.
   * @param searchQuery string
   */
  private filterRegions(searchQuery: string): void {
    // split search query into individual queries
    const searchQueries = searchQuery.trim().split(' ');
    const isNumberSearch = !isNaN(+searchQuery);

    // filter regions by gemeinde name containing all search queries
    const regions = this.regions()
      .filter((region) => {
        if (
          region.type !== SearchSuggestionDisplayType.WeiterePlz &&
          region.type !== SearchSuggestionDisplayType.Ortschaft
        ) {
          return searchQueries.every((query) => {
            if (isNumberSearch) {
              return (
                region.plz?.startsWith(query) ||
                region.nummer === +query ||
                region.kgNummer === +query
              );
            } else {
              return region.gemeinde
                ?.toLowerCase()
                .includes(query.toLowerCase());
            }
          });
        }
        return false;
      })
      .sort(this.sortByGemeindeName(searchQuery));

    // create SearchRegionResult from filtered regions
    const res = this.createSearchRegionResult(regions);
    // set the filtered regions
    this.filteredRegions.set(res);
  }

  /**
   * filterPlzs
   * Filters regions for plzs (postal codes) by name and updates the filteredRegions signal.
   * @param searchQuery string
   */
  private filterPlzs(searchQuery: string): void {
    // split search query into individual queries
    const searchQueries = searchQuery.trim().split(' ');
    const isNumberSearch = !isNaN(+searchQuery);

    // filter regions by gemeinde name containing all search queries
    const regions = this.regions()
      .filter((region) => {
        if (
          region.type === SearchSuggestionDisplayType.WeiterePlz ||
          region.type === SearchSuggestionDisplayType.Ortschaft ||
          region.type === SearchSuggestionDisplayType.Gemeinde
        ) {
          return searchQueries.every((query) => {
            if (isNumberSearch) {
              return region.plz?.startsWith(query);
            } else {
              return (
                region.gemeinde?.toLowerCase().includes(query.toLowerCase()) ||
                region.ortschaft?.toLowerCase().includes(query.toLowerCase())
              );
            }
          });
        }
        return false;
      })
      .sort(this.sortByGemeindeName(searchQuery));

    // create SearchRegionResult from filtered regions
    const res = this.createSearchRegionResult(regions);
    // set the filtered regions
    this.filteredZips.set(res);
  }

  /**
   * filterCiteis
   * Filters regions for ortschaften (localities) by name and updates the filteredCities signal.
   * @param searchQuery string
   */
  private filterCiteis(searchQuery: string): void {
    // split search query into individual queries
    const searchQueries = searchQuery.trim().split(' ');
    const isNumberSearch = !isNaN(+searchQuery);

    // filter regions by gemeinde name containing all search queries
    const regions = this.regions()
      .filter((region) => {
        if (
          region.type === SearchSuggestionDisplayType.Ortschaft ||
          region.type === SearchSuggestionDisplayType.Gemeinde ||
          region.type === SearchSuggestionDisplayType.WeiterePlz
        ) {
          return searchQueries.every((query) => {
            if (isNumberSearch) {
              return region.plz?.startsWith(query);
            } else {
              return (
                region.isMainPlz &&
                (region.ortschaft
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
                  region.gemeinde?.toLowerCase().includes(query.toLowerCase()))
              );
            }
          });
        }
        return false;
      })
      .sort(this.sortByGemeindeName(searchQuery));

    // create SearchRegionResult from filtered regions
    const res = this.createSearchRegionResult(regions, EnSearchMode.Ortschaft);
    // set the filtered regions
    this.filteredCities.set(res);
  }

  /**
   * searchRegions
   * Searches for regions by postal code (PLZ) and updates the filteredRegions signal.
   * @param searchQuery string
   */
  public searchRegions(searchQuery: string): void {
    if (!searchQuery || searchQuery.length < 3 || !this.regions().length) {
      this.filteredRegions.set([]);
      return;
    }
    this.filterRegions(searchQuery);
  }

  /**
   * searchPlz
   * Searches for regions by postal code (PLZ) and updates the filteredRegions signal.
   * @param searchQuery string
   * @returns void
   */
  public searchPlz(searchQuery: string): void {
    if (!searchQuery || searchQuery.length < 3 || !this.regions().length) {
      this.filteredZips.set([]);
      return;
    }
    this.filterPlzs(searchQuery);
  }

  /**
   * searchOrtschaft
   * Searches for ortschaften (localities) by name and updates the filteredRegions signal.
   * @param searchQuery string
   * @returns void
   */
  public searchOrtschaft(searchQuery: string): void {
    if (!searchQuery || searchQuery.length < 3 || !this.regions().length) {
      this.filteredCities.set([]);
      return;
    }
    this.filterCiteis(searchQuery);
  }

  /**
   * sortByGemeindeName
   * Sorts regions by name, prioritizing Gemeinde over Ortschaft and matches by relevance.
   * Sort priority:
   * 1. Gemeinde before Ortschaft
   * 2. Exact matches
   * 3. Starts with matches
   * 4. Alphabetical order
   * @param searchQuery string
   * @returns comparison function for sorting
   */
  private sortByGemeindeName(searchQuery: string) {
    const query = searchQuery.toLowerCase();

    return (a: RegionItem, b: RegionItem) => {
      // First prioritize by type (Gemeinde before Ortschaft)
      if (a.type !== b.type) {
        return a.type === SearchSuggestionDisplayType.Gemeinde ? -1 : 1;
      }

      // Get the appropriate names for comparison
      const aName =
        (a.type === SearchSuggestionDisplayType.Ortschaft
          ? a.ortschaft
          : a.gemeinde
        )?.toLowerCase() || '';
      const bName =
        (b.type === SearchSuggestionDisplayType.Ortschaft
          ? b.ortschaft
          : b.gemeinde
        )?.toLowerCase() || '';

      // Exact matches first
      if (aName === query && bName !== query) return -1;
      if (bName === query && aName !== query) return 1;

      // Then starts-with matches
      const aStarts = aName.startsWith(query);
      const bStarts = bName.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Finally alphabetical order
      return aName.localeCompare(bName);
    };
  }
}
