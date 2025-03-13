import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from '../../../models/country';
import { DecimalPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-country',
  imports: [DecimalPipe, MatTooltipModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
})
export class CountryComponent {
  private readonly router = inject(Router);

  public country: Country;

  public get displayLanguages(): string {
    if (!this.country || !this.country.languages) return '';
    return Object.values(this.country.languages).join(', ');
  }

  constructor() {
    this.country = this.router.getCurrentNavigation()?.extras.state as Country;
  }
}
