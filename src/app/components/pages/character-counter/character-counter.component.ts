import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CharacterState, Frequency } from '../../models/character-counter';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';

@Component({
  selector: 'app-character-counter',
  // Corrected styleUrls and removed duplicate MatIconModule import.
  imports: [
    SectionTitleComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    NgTemplateOutlet,
    NgClass,
    SlicePipe,
  ],
  templateUrl: './character-counter.component.html',
  styleUrl: './character-counter.component.scss',
  animations: [
    trigger('slideToggle', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class CharacterCounterComponent {
  // Input and configuration properties
  public characters = '';
  public excludeSpace = false;
  public characterLimit = false;
  public totalCharacters = 0;
  public totalWords = 0;
  public totalSentence = 0;

  // signal properties
  public characterStats = signal<CharacterState[]>([]);
  public isExpanded = true;

  /**
   * onInput
   * Processes input text, updating counts for characters, words, and sentences.
   */
  public onInput(): void {
    const trimmedText = this.characters.trim();

    // If input is empty, reset counts and return early.
    if (!trimmedText) {
      this.resetCounts();
      return;
    }

    this.countText(trimmedText);
  }

  /**
   * countText
   * Counts characters, words, sentences, and character frequency
   * @param text string
   */
  private countText(text: string): void {
    const countSpaces = this.countSpaces(text);

    // Update total character count, excluding spaces if needed.
    this.totalCharacters = this.excludeSpace
      ? text.length - countSpaces
      : text.length;

    // Use regex splitting to ignore extra whitespace and filter out empty strings.
    this.totalWords = text.split(/\s+/).filter((word) => word).length;

    // Simple sentence splitting assuming sentences end with a period followed by a space.
    this.totalSentence = text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;

    // Count each character's frequency
    const frequency: Frequency = {};
    for (const char of text) {
      const charLower = char.toLocaleLowerCase();
      frequency[charLower] = (frequency[charLower] || 0) + 1;
    }

    // Build the characterStats array with the frequency and percentage calculations
    this.characterStats.set([]);
    for (const char in frequency) {
      const count = frequency[char];
      const percentage = this.totalCharacters
        ? (count / this.totalCharacters) * 100
        : 0;

      // update characterState signal
      this.characterStats.update((value) => [
        ...value,
        { char, count, percentage },
      ]);
    }

    // Optionally sort by frequency in descending order
    this.characterStats.update((values) => {
      return values.sort((a, b) => b.count - a.count);
    });
  }

  /**
   * countSpaces
   * @param text string -> input text
   * @returns number
   */
  private countSpaces(text: string): number {
    let ret = 0;
    // loop through all text to find space in input texts
    for (const char of text) {
      if (char === ' ') {
        ret++;
      }
    }
    return ret;
  }

  /**
   * onShowMore
   * Toggles the display of used characters between a collapsed (first 4 characters)
   * and an expanded view (all used characters).
   */
  public onShowMore(): void {
    this.isExpanded = !this.isExpanded;
  }

  /**
   * resetCounts
   * Resets all count values and clears the list of used characters.
   */
  private resetCounts(): void {
    this.totalCharacters = 0;
    this.totalWords = 0;
    this.totalSentence = 0;
    this.characterStats.set([]);
  }
}
