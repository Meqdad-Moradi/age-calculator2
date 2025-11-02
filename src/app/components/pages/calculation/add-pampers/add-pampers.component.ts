import { Component, inject, output } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
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
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    date: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

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
