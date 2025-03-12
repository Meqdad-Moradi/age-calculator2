import { Component, input } from '@angular/core';
import { Country } from '../../models/country';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-country-card',
  imports: [MatTooltipModule],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
})
export class CountryCardComponent {
  public countryInput = input<Country>();
}
