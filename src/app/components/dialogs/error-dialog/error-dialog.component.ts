import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ShowErrorMessage } from '../../models/error-response.model';

@Component({
  selector: 'app-error-dialog',
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
  ],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss',
})
export class ErrorDialogComponent {
  public data: ShowErrorMessage = inject(MAT_DIALOG_DATA);

  public isDetailsShowing = signal<boolean>(false);
  public btnLabel = computed(() =>
    !this.isDetailsShowing() ? 'Show more details' : 'Hide details'
  );

  public onShowDetails(): void {
    this.isDetailsShowing.update((value) => !value);
  }
}
