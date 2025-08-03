import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-select-search',
  imports: [MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSearchComponent),
      multi: true,
    },
  ],
})
export class SelectSearchComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  public readonly matSelect = inject(MatSelect);

  @Input() placeholder = 'Search…';

  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;

  control = new FormControl<string>('');
  disabled = false;

  private destroy$ = new Subject<void>();

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {
    // do nothing by default
  };
  private onTouched: () => void = () => {
    // do nothing by default
  };

  ngOnInit(): void {
    // propagate input changes to the parent form
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value ?? '');
        this.onTouched();
      });

    // autofocus and reset search when dropdown opens/closes
    this.matSelect.openedChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((open) => {
        if (open) {
          // focus next tick
          setTimeout(() => this.searchInput.nativeElement.focus(), 0);
        } else {
          this.control.reset('');
        }
      });
  }

  ngOnDestroy(): void {
    console.log('SelectSearchComponent destroyed!');
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * writeValue
   * @param value - The value to write to the control.
   * Writes a value to the control, without emitting an event.
   */
  writeValue(value: string): void {
    this.control.setValue(value, { emitEvent: false });
  }

  /**
   * registerOnChange
   * @param fn - The function to call when the control's value changes.
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * registerOnTouched
   * @param fn - The function to call when the control is touched.
   * Registers a callback function to be called when the control is touched.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * setDisabledState
   * @param isDisabled - Whether the control should be disabled.
   * Disables or enables the control based on the provided state.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  /**
   * onSearchClick
   * @param event - The click event to handle.
   * prevent closing the panel when clicking inside search area
   */
  onSearchClick(event: Event): void {
    event.stopPropagation();
  }
}
