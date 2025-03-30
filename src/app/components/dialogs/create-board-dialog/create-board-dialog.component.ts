import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-board-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-board-dialog.component.html',
  styleUrl: './create-board-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBoardDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateBoardDialogComponent>);

  public control = new FormControl('', [Validators.required]);

  /**
   * onCancelClick
   */
  public onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * onOkClick
   */
  public onOkClick(): void {
    if (!this.control.value) return;
    this.dialogRef.close(this.control.value);
  }
}
