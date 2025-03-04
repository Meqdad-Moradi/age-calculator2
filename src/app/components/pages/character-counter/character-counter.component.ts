import { Component } from '@angular/core';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-character-counter',
  imports: [SectionTitleComponent, MatFormFieldModule, MatInputModule],
  templateUrl: './character-counter.component.html',
  styleUrl: './character-counter.component.scss',
})
export class CharacterCounterComponent {}
