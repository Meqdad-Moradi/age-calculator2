import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Country } from '../../components/models/country';

@Injectable({
  providedIn: 'root',
})
export class ApiCountriesService {
  private http = inject(HttpClient);
  // private readonly baseUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,continents,region,area,population,languages';
  // private readonly baseUrl = 'https://restcountries.com/v3.1/all';
  private readonly baseUrl = 'http://localhost:3000/countries';

  // https://restcountries.com/#api-endpoints-using-this-project

  public countries = toSignal(this.http.get<Country[]>(this.baseUrl), {
    initialValue: [] as Country[],
  });
}
