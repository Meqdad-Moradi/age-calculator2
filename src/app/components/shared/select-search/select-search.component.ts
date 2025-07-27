import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-select-search',
  imports: [MatInputModule, FormsModule, ReactiveFormsModule],
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
export class SelectSearchComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  // public properties
  public value = '';
  public disabled = false;
  public control = new FormControl<string>('');

  // private properties
  private onDestroy = new Subject();

  // control value accessor
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
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((v) => {
      if (!v) return;
      this.onChange(v);
      this.onTouched();
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.complete();
  }

  public onClick(e: Event): void {
    e.stopPropagation();
  }
}
