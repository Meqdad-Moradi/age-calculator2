import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-select-search',
  imports: [MatInputModule],
  templateUrl: './select-search.component.html',
  styleUrl: './select-search.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSearchComponent),
      multi: true,
    },
  ],
})
export class SelectSearchComponent implements ControlValueAccessor {
  value = '';
  disabled = false;

  onChange!: (value: string) => void;
  onTouched!: () => void;

  writeValue(obj: string): void {
    this.value = obj;
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
