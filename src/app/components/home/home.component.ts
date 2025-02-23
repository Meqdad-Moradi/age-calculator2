import { formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, FormsModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snackbar = inject(MatSnackBar);

  public result = 0;

  // Form group for the calculator form
  public calculatorForm = this.fb.group({
    date: ['', [Validators.required]],
  });

  /**
   * Submit handler for the form
   * @param e Event
   * @returns void
   */
  public submit(e: Event): void {
    e.preventDefault();

    // If the form is invalid, do nothing
    if (this.calculatorForm.invalid) {
      this.snackbar.open('Please enter a valid date', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    // Get the value of the date input field
    const inputValue = this.calculatorForm.get('date')?.value;

    // Calculate the age difference and set the result
    this.result = this.calculateDiff(inputValue || '');
  }

  /**
   * calculateDiff
   * Method to calculate the difference in years between the input date and the current date
   * @param value string
   * @returns number
   */
  private calculateDiff(value: string): number {
    // Format the input date to 'yyyy-MM-dd'
    const formatedDate = formatDate(value!, 'yyyy-MM-dd', 'en-US');
    // Create a Date object from the formatted date
    const birthdate = new Date(formatedDate);

    // Calculate the time difference in milliseconds
    const timeDiff = Math.abs(Date.now() - birthdate.getTime());
    // Convert the time difference from milliseconds to years
    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age;
  }
}
