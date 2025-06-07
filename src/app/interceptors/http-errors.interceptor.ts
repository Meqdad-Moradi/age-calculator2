import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorService } from '../services/error.service';

export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  return next(req).pipe(errorService.handleError('err.message'));
};
