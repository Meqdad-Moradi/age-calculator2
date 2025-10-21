import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter, startWith } from 'rxjs';
import { HighlightPipe } from '../../../pipes/highlight.pipe';
import { ApiRegionService } from '../../../services/api/api-region.service';
import { ErrorResponse } from '../../models/error-response.model';
import {
  EnSearchMode,
  RegionItem,
  SearchRegionResult,
} from '../../models/search-index';

@Component({
  selector: 'app-search-region',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HighlightPipe,
  ],
  templateUrl: './search-region.component.html',
  styleUrl: './search-region.component.scss',
})
export class SearchRegionComponent implements OnInit {
  private readonly apiRegionService = inject(ApiRegionService);
  private readonly destroyRef = inject(DestroyRef);

  public regions = this.apiRegionService.filteredRegions;
  public zips = this.apiRegionService.filteredZips;
  public cities = this.apiRegionService.filteredCities;
  public regionControl = new FormControl<string>('');
  public zipControl = new FormControl<string>('');
  public cityControl = new FormControl<string>('');

  public zipInput = viewChild<ElementRef<HTMLInputElement>>('zipInput');
  public cityInput = viewChild<ElementRef<HTMLInputElement>>('cityInput');

  ngOnInit(): void {
    this.getRegions();
    this.setupSearchSubscriptions();
  }

  /**
   * Setup search subscriptions for all controls
   */
  private setupSearchSubscriptions(): void {
    // Region search subscription
    this.regionControl.valueChanges
      .pipe(
        startWith(''),
        filter((val) => typeof val === 'string'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.apiRegionService.searchRegions(value || ''));

    // ZIP code search subscription
    this.zipControl.valueChanges
      .pipe(
        startWith(''),
        filter((val) => typeof val === 'string'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        const res = this.apiRegionService.searchPlz(value || '');
        this.apiRegionService.filteredZips.set(res);
      });

    // City search subscription
    this.cityControl.valueChanges
      .pipe(
        startWith(''),
        filter((val) => typeof val === 'string'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        const res = this.apiRegionService.searchOrtschaft(value || '');
        this.apiRegionService.filteredCities.set(res);
      });
  }

  /**
   * Initialize regions data
   */
  private getRegions(): void {
    this.apiRegionService
      .getRegions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response instanceof ErrorResponse) {
          return;
        }
        this.apiRegionService.flatRegions(response);
      });
  }

  /**
   * createSearchResult
   * @param regionItems RegionItem[]
   * @returns SearchRegionResult
   */
  public createSearchResult(
    regionItems: RegionItem[],
    searchMode: EnSearchMode,
  ): SearchRegionResult[] {
    return this.apiRegionService.createSearchRegionResult(
      regionItems,
      searchMode,
    );
  }

  /**
   * onZipSelected
   * @param event MatAutocompleteSelectedEvent
   */
  public onZipSelected(): void {
    const zipRegion = this.apiRegionService.filteredZips();
    this.apiRegionService.filteredCities.set(zipRegion);

    // Use setTimeout to ensure the value is set before focusing
    setTimeout(() => {
      const inputElement = this.cityInput()?.nativeElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    });
  }
}
