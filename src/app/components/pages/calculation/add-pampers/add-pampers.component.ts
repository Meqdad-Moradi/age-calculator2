import { Component, inject, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Pampers } from '../../../models/pampers';

@Component({
  selector: 'app-add-pampers',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-pampers.component.html',
  styleUrl: './add-pampers.component.scss',
})
export class AddPampersComponent {
  private fb = inject(FormBuilder);

  public addNewItem = output<Pampers>();

  public pampersForm = this.fb.group({
    name: [
      '',
      {
        validators: [Validators.required, this.validateName()],
        updateOn: 'change',
      },
    ],
    price: ['', [Validators.required, this.validatePrice()]],
    date: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  /**
   * validateName
   * @returns ValidatorFn
   */
  private validateName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;

      if (!/^[a-zA-Z]+$/.test(value)) {
        return { errorMsg: 'Name can only contain letters.' };
      }
      if (value.length < 3) {
        return { errorMsg: 'Name must be at least 3 characters long.' };
      }

      return null;
    };
  }

  /**
   * validatePrice
   * @returns ValidatorFn
   */
  private validatePrice(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as number;
      if (value == null) return null;
      if (+value < 0.01) {
        return { errorMsg: 'Price must be a valid number greater than €0' };
      }
      return null;
    };
  }

  /**
   * onSubmit
   * @returns void
   */
  public onSubmit(): void {
    if (this.pampersForm.invalid) return;
    const formValue = this.pampersForm.value as Pampers;
    this.addNewItem.emit(formValue);
  }
}
