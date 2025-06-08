import { HttpInterceptorFn } from '@angular/common/http';

export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
  //   .pipe(
  //   retry({
  //     count: 3,
  //     delay: (error, retryCounter) => timer(retryCounter * 1000),
  //   })
  // );
};
