import { Component, input } from '@angular/core';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-control',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './input-control.component.html',
  styleUrl: './input-control.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class InputControlComponent {
  control = input<string>();
}
