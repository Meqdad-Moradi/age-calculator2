import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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

  public phoneform: FormGroup = this.fb.group({
    phone: ['af'],
    country: [''],
  });

  public onSubmit(e: Event): void {
    e.preventDefault();
    console.log(this.phoneform.value);
  }
}
