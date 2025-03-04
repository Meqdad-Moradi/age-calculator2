import { formatDate, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import moment from 'moment';
import { Age } from '../../../helpers/age';
import { SectionTitleComponent } from "../../shared/section-title/section-title.component";

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgTemplateOutlet,
    SectionTitleComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snackbar = inject(MatSnackBar);

  public age!: Age;
  public currentDate = new Date();

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
    if (this.calculatorForm.invalid) return;

    // Get the value of the date input field
    const inputValue = this.calculatorForm.get('date')?.value;

    // Calculate the age difference and set the result
    this.calculateAgeDiff(inputValue || '');
  }

  /**
   * calculateAgeDiff
   * Method to calculate the difference in years, months, and days between the input date and the current date
   * @param value string
   * @returns void
   */
  private calculateAgeDiff(value: string): void {
    // Format the input date to 'yyyy-MM-dd'
    const formattedDate = formatDate(value, 'yyyy-MM-dd', 'de-DE');
    // Create a moment object from the formatted date
    const birthdate = moment(formattedDate);
    const now = moment();

    // Calculate full years
    const years = now.diff(birthdate, 'years');
    // Add years to birth date for the remaining diff
    const updatedBirth = birthdate.clone().add(years, 'years');

    // Calculate full months after years
    const months = now.diff(updatedBirth, 'months');
    const updatedBirthWithMonths = updatedBirth.clone().add(months, 'months');

    // Remaining days difference
    const days = now.diff(updatedBirthWithMonths, 'days');

    const result = { years, months, days };
    if (!result) {
      this.displaySnackbar('No date or birthdate is selected!');
      return;
    }

    this.age = result;
  }

  /**
   * displaySnackbar
   * Method to display a snackbar with a given message
   * @param message string
   * @returns void
   */
  private displaySnackbar(message: string): void {
    this.snackbar.open(message, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
