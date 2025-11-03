import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmMessage } from '../../models/confirm-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<ConfirmationDialogComponent>,
  );
  public data = inject<ConfirmMessage>(MAT_DIALOG_DATA);

  constructor() {
    this.dialogRef.disableClose = true;
  }

  /**
   * onNoClick
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * onConfirm
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
