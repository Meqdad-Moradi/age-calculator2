import { Component, inject, OnInit } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiRegionService } from '../../../services/api/api-region.service';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-search-region',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-region.component.html',
  styleUrl: './search-region.component.scss',
})
export class SearchRegionComponent implements OnInit {
  private readonly apiRegionService = inject(ApiRegionService);

  public regions = this.apiRegionService.filteredRegions;
  public regionControl = new FormControl<string>('');

  ngOnInit(): void {
    this.regionControl.valueChanges.pipe(startWith('')).subscribe((value) => {
      if (!value) return;
      // search for plz
      this.apiRegionService.searchGemeinde(value);
    });
  }
}
