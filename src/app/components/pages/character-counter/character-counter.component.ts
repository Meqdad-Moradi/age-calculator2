import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-character-counter',
  imports: [
    SectionTitleComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './character-counter.component.html',
  styleUrl: './character-counter.component.scss',
})
export class CharacterCounterComponent {
  public characters = '';
  public excludeSpace = false;
  public characterLimit = false;
  public totalCharacters = 0;
  public totalWords = 0;
  public totalSentence = 0;

  /**
   * onInput
   */
  public onInput(): void {
    // do nothing, if there is no text in the input box
    if (!this.characters.length) return;

    const char = this.characters.trim();
    // handle exclude space between characters
    if (this.excludeSpace) {
      this.totalCharacters = char.length - this.handleExcludeSpace();
    } else {
      this.totalCharacters = char.length;
    }

    this.totalWords = char.split(' ').length;
    this.totalSentence = char.split('. ').length;
  }

  public handleExcludeSpace(): number {
    let countSpace = 0;

    for (const s of this.characters.trim()) {
      if (s === ' ') {
        countSpace++;
      }
    }

    return countSpace;
  }
}
