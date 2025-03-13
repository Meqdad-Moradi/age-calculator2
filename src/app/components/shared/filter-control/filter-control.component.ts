import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filter-control',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './filter-control.component.html',
  styleUrl: './filter-control.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class FilterControlComponent {
  public searchQuery = model<string>();
  public filterQuery = model<string>();

  public filterOption = ['Asia', 'Africa', 'America', 'Europe', 'Oceania'];
}
