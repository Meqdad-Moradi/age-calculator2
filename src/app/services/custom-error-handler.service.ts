import { inject, Injectable } from '@angular/core';
import { ConfirmationDialogComponent } from '../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ErrorAction,
  ErrorResponses,
} from '../components/models/error-response.model';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CustomErrorHandlerService {
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);

  /**
   * isStatusCodeInWhitelist
   *  check if error status code is in whitelist
   * @param statusCodesWhitelist number[]
   * @param errorStatusCode number
   * @returns boolean
   */
  private isStatusCodeInWhitelist(
    statusCodesWhitelist: number[],
    errorStatusCode: number
  ): boolean {
    if (!statusCodesWhitelist?.length) {
      return false;
    }

    return statusCodesWhitelist.includes(errorStatusCode);
  }

  /**
   * showErrorInDialog
   *  opens the confirmation dialog to show the error message
   * @param errorMessage message to show
   * @param [requestId=''] requestId to be shown in details
   * @returns void
   */
  public showErrorInDialog(errorMessage: string, requestId = ''): void {
    let showMoreMsg = '';

    if (requestId) {
      showMoreMsg = `
      <p>RequestId: ${requestId}</p>`;
    }
    showMoreMsg += `<p>
          Wenn der Fehler bestehen bleibt, wenden Sie sich bitte an unser <a href="${'https://www.google.com'}" target="_blank">
          Support-Team</a>.
        </p>`;

    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        labelConfirmButton: 'Schließen',
        disableAbort: true,
        message: `
        <p>
          <b>Fehlermeldung</b>
        </p>
        <p>${errorMessage}</p>`,
        showMoreMsg,
      },
    });
  }

  /**
   * handleError
   *  according to the provided errorAction parameter the following scenarios exist:
   *  1. if errorAction.valueToReturn is provided than it has the highest priority, that means valueToReturn is returned
   *  2. if errorAction.valueToReturn and errorAction.customErrorMessage are provided, than valueToReturn is returned and
   *     customErrorMessage is shown in snackbar or dialog if errorAction.showErrorInSnackbar or errorAction.showErrorInDialog are provided
   *  3. if only errorAction.customErrorMessage is provided, than this value is returned
   *  4. if neither errorAction.customErrorMessage or errorAction.valueToReturn is provided, than we return the error message from
   *     the HTTP request
   *  5. if no errorAction parameter is provided we again return the error message from the HTTP request
   * @param operation string
   * @param errorAction  ErrorAction<T>
   * @returns Observable<ErrorResponse>
   */
  public handleError<T>(
    operation: string,
    errorAction: ErrorAction<T> = { logError: true }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): (error: any) => Observable<ErrorResponses<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any): Observable<ErrorResponses<T>> => {
      if (errorAction.logError === undefined) {
        errorAction.logError = true;
      }

      // parse error message from error object
      const requestId = error?.error?.error?.traceId;
      let errorMessage = '';

      if (errorAction.customErrorMessage) {
        errorMessage = errorAction.customErrorMessage;
      } else {
        try {
          // using the http error response
          if (typeof error.error === 'string') {
            // due to the openapi configuration from our backend for some requests no response types are specified, thus the ng-open-api tool
            // uses 'text' as default return type, so we get the error object as string which we have to parse in order to get the
            // error message
            try {
              const parsedError = JSON.parse(error.error);
              errorMessage = parsedError?.error?.message;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (parsingError) {
              // couldn't parse the response error, so we return the not parsable error, which we know is a string
              errorMessage = error?.error;
            }
          } else {
            //try different scenarios for error-message retrieval
            errorMessage =
              error?.error?.error?.message ||
              error?.error?.message ||
              error?.message;

            if (!errorMessage) {
              // if no error message could be parsed, then we assume that user has no internet connection
              errorMessage =
                'Der Server scheint nicht erreichbar zu sein. Eventuell besteht keine Verbindung zum Internet.';
            }
          }

          if (error.status === 0) {
            errorMessage = `Diese Anfrage an den ADVOKAT Online Server scheitert:
            <p>${error.url}</p>
            <p>Falls Ihre Internetverbindung intakt ist, wird die Anfrage von Ihrem Rechner oder Netzwerk blockiert.</p>
            <a href="https://advokat.atlassian.net/wiki/x/6pexAg" target="_blank">→ Hilfeseite anzeigen</a>`;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (parsingError) {
          errorMessage = 'Fehlermeldung konnte nicht ermittelt werden';
        }
      }

      // log or display error if error status code is not in the provided whitelist
      if (
        !this.isStatusCodeInWhitelist(
          errorAction.statusCodesWhitelist!,
          error.status
        )
      ) {
        if (errorAction.logError) {
          // log the error object
          // LogHandler.error(operation, error);
          console.error(operation, error);
        }

        if (errorAction.showErrorInSnackbar) {
          this.snackbar.open(errorMessage, 'OK');
        }

        if (errorAction.showErrorInDialog) {
          this.showErrorInDialog(errorMessage, requestId);
        }
      }

      return of(
        new ErrorResponses<T>(
          error.status,
          errorAction.valueToReturn !== undefined
            ? errorAction.valueToReturn
            : errorMessage
        )
      );
    };
  }
}
