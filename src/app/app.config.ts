import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
} from '@angular/material/tooltip';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
const matTooltipDefaultOptions = MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
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
