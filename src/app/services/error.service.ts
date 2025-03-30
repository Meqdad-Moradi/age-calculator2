import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly snackbar = inject(MatSnackBar);

  /**
   * displayErrorMsg
   * @param msg string => snackbar message
   */
  public displayErrorMsg(msg: string): void {
    this.snackbar.open(msg, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    });
  }
}
