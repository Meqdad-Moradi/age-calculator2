import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TelInputComponent } from '../../../shared/tel-input/tel-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-phone',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TelInputComponent,
    SelectSearchComponent,
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss',
})
export class PhoneComponent {
  private readonly fb = inject(FormBuilder);

  private phonePattern = /^\+[\d]*$/;

  public get formControls() {
    return this.phoneform.controls;
  }

  public phoneform: FormGroup = this.fb.group({
    phone: ['af', [this.validatePhoneNumber(), Validators.maxLength(14)]],
    country: [''],
  });

  private validatePhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let msg = '';
      if (control.value && !this.phonePattern.test(control.value)) {
        msg = 'please provide a correct phone number like: +12345678901234';
      }

      if (msg) {
        return { errorMsg: msg };
      }
      return null;
    };
  }

  public onSubmit(e: Event): void {
    e.preventDefault();
    if (this.phoneform.invalid) return;
    console.log(this.phoneform.value);
  }
}
