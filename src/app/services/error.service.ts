import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';
import {
  ErrorOption,
  ErrorResponse,
  ShowErrorMessage,
} from '../components/models/error-response.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly snackbar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  /**
   * showErrorInSnackbar
   * @param msg string => error message
   */
  private showErrorInSnackbar(msg: string): void {
    this.snackbar.open(msg, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    });
  }

  /**
   * showErrorInDialog
   * @param error ShowErrorMessage
   */
  private showErrorInDialog(error: ShowErrorMessage): void {
    this.dialog.open(ErrorDialogComponent, {
      data: error,
      maxWidth: 500,
    });
  }

  public handleError<T>(
    operation: string,
    options: ErrorOption = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): (error: any) => Observable<ErrorResponse<T>> {
    return (error) => {
      const errorResp = this.buildErrorResponse(error, operation);
      this.displayError(errorResp, options);
      return of(new ErrorResponse<T>(errorResp.status, errorResp.message));
    };
  }

  // /**
  //  * Returns an RxJS operator that catches HTTP errors, wraps them
  //  * in an ErrorResponse, optionally shows them, and re-throws.
  //  */
  // public handleError<T>(
  //   operation = 'operation',
  //   options: ErrorOption = {}
  // ): OperatorFunction<T, T> {
  //   return (source: Observable<T>) =>
  //     source.pipe(
  //       catchError((error) => {
  //         const errResp = this.buildErrorResponse(error, operation);
  //         this.displayError(errResp, options);
  //         return throwError(() => errResp);
  //       })
  //     );
  // }

  /**
   * buildErrorResponse
   * Build a uniform ErrorResponse from any HttpErrorResponse
   * @param error
   * @param operation
   * @returns void
   */
  private buildErrorResponse<T>(
    error: HttpErrorResponse,
    operation: string
  ): ErrorResponse<T> {
    if (error.error instanceof ErrorEvent) {
      return new ErrorResponse<T>(
        0,
        `Local network error: ${error.error.message}`
      );
    }

    return new ErrorResponse<T>(
      error.status,
      `${operation} failed: ${error.url}`,
      {
        message: error.message,
        raw: error.error,
      } as unknown as T
    );
  }

  /**
   * displayError
   * Show the error in dialog or snackbar per options
   * @param errorResponse ErrorResponse
   * @param options ErrorOptions
   * @returns void
   */
  private displayError<T>(
    errorResponse: ErrorResponse<T>,
    options: ErrorOption
  ): void {
    const { showInDialog, showInSnackbar } = options;
    const payload: ShowErrorMessage = {
      name: errorResponse.name,
      message: errorResponse.message,
      details: errorResponse.status + ' ' + errorResponse.details.raw,
    };

    if (showInDialog) {
      this.showErrorInDialog(payload);
    } else if (showInSnackbar) {
      this.showErrorInSnackbar(errorResponse.message);
    }
  }
}
