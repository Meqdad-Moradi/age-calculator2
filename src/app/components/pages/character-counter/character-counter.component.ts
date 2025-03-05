import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { alphabetLower } from '../../models/character-counter';

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
    FormsModule,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './character-counter.component.html',
  styleUrl: './character-counter.component.scss',
})
export class CharacterCounterComponent {
  // Input and configuration properties
  public characters = '';
  public excludeSpace = false;
  public characterLimit = false;
  public totalCharacters = 0;
  public totalWords = 0;
  public totalSentence = 0;

  // Signals to manage state
  public charUsed = signal<string[]>([]);
  public endIndex = signal(4);

  // Computed properties for UI binding
  public filteredCharsUsed = computed(() =>
    this.charUsed().slice(0, this.endIndex())
  );
  public isCollapsed = computed(() => this.filteredCharsUsed().length <= 4);

  /**
   * onInput
   * Processes input text, updating counts for characters, words, and sentences.
   */
  public onInput(): void {
    const trimmedInput = this.characters.trim();

    // If input is empty, reset counts and return early.
    if (!trimmedInput) {
      this.resetCounts();
      return;
    }

    // Process the input text to update the list of used characters and count spaces.
    const spaceCount = this.processCharacters(trimmedInput);

    // Update total character count, excluding spaces if needed.
    this.totalCharacters = this.excludeSpace
      ? trimmedInput.length - spaceCount
      : trimmedInput.length;

    // Use regex splitting to ignore extra whitespace and filter out empty strings.
    this.totalWords = trimmedInput.split(/\s+/).filter((word) => word).length;
    // Simple sentence splitting assuming sentences end with a period followed by a space.
    this.totalSentence = trimmedInput
      .split('. ')
      .filter((sentence) => sentence).length;
  }

  /**
   * processCharacters
   * Iterates through the text, updating the unique used characters list
   * and counts the number of spaces.
   * @param text - The trimmed input text.
   * @returns The count of space characters.
   */
  private processCharacters(text: string): number {
    let spaceCount = 0;
    const usedChars: string[] = [];

    for (const char of text) {
      if (char === ' ') {
        spaceCount++;
      }
      // Check if the character is a letter (ignoring case) and not already included.
      if (
        alphabetLower.includes(char.toLowerCase()) &&
        !usedChars.includes(char)
      ) {
        usedChars.push(char);
      }
    }

    // Update the signal with the unique characters.
    this.charUsed.set(usedChars);
    return spaceCount;
  }

  /**
   * onShowMore
   * Toggles the display of used characters between a collapsed (first 4 characters)
   * and an expanded view (all used characters).
   */
  public onShowMore(): void {
    if (this.filteredCharsUsed().length <= 4) {
      // Expand: set the end index to the total number of unique characters.
      this.endIndex.set(this.charUsed().length);
    } else {
      // Collapse: reset to showing only the first 4 characters.
      this.endIndex.set(4);
    }
  }

  /**
   * resetCounts
   * Resets all count values and clears the list of used characters.
   */
  private resetCounts(): void {
    this.totalCharacters = 0;
    this.totalWords = 0;
    this.totalSentence = 0;
    this.charUsed.set([]);
  }
}
