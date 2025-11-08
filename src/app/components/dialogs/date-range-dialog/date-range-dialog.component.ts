import { Component, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateRangeData, SelectDateRange } from '../../models/date-range';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-date-range-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './date-range-dialog.component.html',
  styleUrl: './date-range-dialog.component.scss',
})
export class DateRangeDialogComponent {
  public readonly dialogRef = inject(MatDialogRef<DateRangeDialogComponent>);
  public readonly data = inject<DateRangeData>(MAT_DIALOG_DATA);

  public dateForm = new FormGroup(
    {
      from: new FormControl<string>('', Validators.required),
      to: new FormControl<string>('', Validators.required),
    },
    { validators: this.dateRangeValidator() }, // attach group-level validator
  );

  /**
   * Validates that the TO date is not before the FROM date
   * @returns ValidatorFn
   */
  private dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Narrow the AbstractControl to FormGroup
      const group = control as FormGroup;

      const from = group.get('from')?.value;
      const to = group.get('to')?.value;

      if (!from || !to) return null;

      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (fromDate > toDate) {
        return { dateRangeError: 'FROM date cannot be after TO date!' };
      }

      return null;
    };
  }

  /**
   * onNoClick
   */
  public onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * onConfirm
   */
  public onConfirm(event: Event): void {
    event.preventDefault();
    // if one the controls has no value, return early
    if (this.dateForm.invalid) return;

    const dateRange: SelectDateRange = {
      fromDate: this.dateForm.get('from')?.value || '',
      toDate: this.dateForm.get('to')?.value || '',
    };

    this.dialogRef.close(dateRange);
  }
}
