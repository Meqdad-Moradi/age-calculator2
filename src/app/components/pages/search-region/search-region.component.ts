import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { startWith } from 'rxjs';
import { ApiRegionService } from '../../../services/api/api-region.service';
import { ErrorResponse } from '../../models/error-response.model';
import { HighlightPipe } from "../../../pipes/highlight.pipe";

@Component({
  selector: 'app-search-region',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HighlightPipe
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
      .pipe(startWith(''), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.apiRegionService.searchRegions(value || '');
      });

    // ZIP code search subscription
    this.zipControl.valueChanges
      .pipe(startWith(''), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.apiRegionService.searchPlz(value);
        }
      });

    // City search subscription
    this.cityControl.valueChanges
      .pipe(startWith(''), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.apiRegionService.searchOrtschaft(value || '');
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
}
