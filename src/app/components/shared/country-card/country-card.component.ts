import { Component, input, output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Country } from '../../models/country';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-country-card',
  imports: [MatTooltipModule, DecimalPipe],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
})
export class CountryCardComponent {
  public countryInput = input<Country>();
  public countryClick = output<Country>();

  public displayCountryDetails(): void {
    this.countryClick.emit(this.countryInput()!);
  }
}
