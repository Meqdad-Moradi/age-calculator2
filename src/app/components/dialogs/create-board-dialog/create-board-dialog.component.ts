import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-board-dialog',
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './create-board-dialog.component.html',
  styleUrl: './create-board-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBoardDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateBoardDialogComponent>);
  public value = signal<string>('');

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
    this.dialogRef.close(this.value())
  }
}
