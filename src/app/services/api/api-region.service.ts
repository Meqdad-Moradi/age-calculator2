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
  public filteredCities = signal<RegionItem[]>([]);
  public filteredZips = signal<RegionItem[]>([]);

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
  public createSearchRegionResult(
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
              return region.kgName?.toLowerCase().includes(query.toLowerCase());
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
  private filterPlzs(searchQuery: string): RegionItem[] {
    // split search query into individual queries
    const searchQueries = searchQuery.trim().split(' ');
    const isNumberSearch = !isNaN(+searchQuery);

    // filter regions by gemeinde name containing all search queries
    return this.regions()
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
  }

  /**
   * filterCiteis
   * Filters regions for ortschaften (localities) by name and updates the filteredCities signal.
   * @param searchQuery string
   */
  private filterCiteis(searchQuery: string): RegionItem[] {
    // split search query into individual queries
    const searchQueries = searchQuery.trim().split(' ');
    const isNumberSearch = !isNaN(+searchQuery);

    // filter regions by gemeinde name containing all search queries
    return this.regions()
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
  public searchPlz(searchQuery: string): RegionItem[] {
    if (!searchQuery || searchQuery.length < 3 || !this.regions().length) {
      this.filteredZips.set([]);
      return [];
    }
    return this.filterPlzs(searchQuery);
  }

  /**
   * searchOrtschaft
   * Searches for ortschaften (localities) by name and updates the filteredRegions signal.
   * @param searchQuery string
   * @returns void
   */
  public searchOrtschaft(searchQuery: string): RegionItem[] {
    if (!searchQuery || searchQuery.length < 3 || !this.regions().length) {
      this.filteredCities.set([]);
      return [];
    }
    return this.filterCiteis(searchQuery);
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
    return (a: RegionItem, b: RegionItem) => {
      const query = searchQuery.toLowerCase();
      const aName =
        (isNaN(+searchQuery)
          ? a.gemeinde || a.ortschaft
          : a.plz
        )?.toLowerCase() || '';
      const bName =
        (isNaN(+searchQuery)
          ? b.gemeinde || b.ortschaft
          : b.plz
        )?.toLowerCase() || '';

      // 1. First sort by type hierarchy (Land -> Bezirk -> Others)
      if (a.type !== b.type) {
        // Land items on top
        if (a.type === SearchSuggestionDisplayType.Land) return -1;
        if (b.type === SearchSuggestionDisplayType.Land) return 1;

        // Bezirk comes after Land
        if (a.type === SearchSuggestionDisplayType.Bezirk) return -1;
        if (b.type === SearchSuggestionDisplayType.Bezirk) return 1;
      }

      // 2. Exact matches go to the top
      const aExactMatch = aName === query;
      const bExactMatch = bName === query;
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // 3. If same gemeinde, sort main gemeinde first, then ortschaften alphabetically
      if (a.gemeinde === b.gemeinde) {
        // Main gemeinde (where gemeinde name equals ortschaft or no ortschaft) comes first
        const aIsMain = !a.ortschaft || a.gemeinde === a.ortschaft;
        const bIsMain = !b.ortschaft || b.gemeinde === b.ortschaft;

        if (aIsMain && !bIsMain) return -1;
        if (!aIsMain && bIsMain) return 1;

        // If both are ortschaften, sort them alphabetically
        if (a.ortschaft && b.ortschaft) {
          return a.ortschaft.localeCompare(b.ortschaft);
        }
      }

      // 4. Sort the rest alphabetically by gemeinde name
      return aName.localeCompare(bName);
    };
  }
}
