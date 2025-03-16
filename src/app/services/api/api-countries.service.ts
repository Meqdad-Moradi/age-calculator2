import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Country } from '../../components/models/country';
import { compare } from '../../helpers/utils';

@Injectable({
  providedIn: 'root',
})
export class ApiCountriesService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/countries';

  public countries = toSignal(
    this.http
      .get<Country[]>(this.baseUrl)
      .pipe(map((c) => c.sort(compare('name.common')))),
    {
      initialValue: [] as Country[],
    }
  );
}
