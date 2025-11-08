import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
} from '@angular/material/tooltip';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { matDateFormat } from './helpers/utils';
import { httpErrorsInterceptor } from './interceptors/http-errors.interceptor';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
const matTooltipDefaultOptions = MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpErrorsInterceptor])),

    // Use MomentDateAdapter instead of NativeDateAdapter
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: matDateFormat },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        ...matTooltipDefaultOptions,
        disableTooltipInteractivity: true,
      },
    },
  ],
};
