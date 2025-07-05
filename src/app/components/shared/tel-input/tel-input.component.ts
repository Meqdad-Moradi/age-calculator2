import { FocusMonitor } from '@angular/cdk/a11y';
import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { allCountries } from '../../models/country';
import { Phone } from '../../models/phone';
import { getCountryByAlpha2Code } from '../../../helpers/utils';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

class CustomErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null): boolean {
    return control?.value && control?.invalid && control?.dirty;
  }
}

@Component({
  selector: 'app-tel-input',
  imports: [
    AsyncPipe,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './tel-input.component.html',
  styleUrl: './tel-input.component.scss',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TelInputComponent,
    },
    {
      provide: ErrorStateMatcher,
      useClass: CustomErrorMatcher,
    },
  ],
})
export class TelInputComponent
  implements
    OnInit,
    MatFormFieldControl<string>,
    ControlValueAccessor,
    AfterViewInit,
    OnDestroy
{
  private readonly fb = inject(FormBuilder);
  private readonly focusMonitor = inject(FocusMonitor);
  @Optional()
  @Self()
  public ngControl = inject(NgControl);
  private errorMatcher = inject(ErrorStateMatcher);

  static nextId = 0;

  @Input() required = false;
  @Input() disabled = false;
  @Input()
  set value(value: string) {
    // update internal form code when parent writes a new value
    this.formControls['code'].setValue(value);
    this.formControls['number'].setValue('');
    this.stateChanges.next();
  }
  get value(): string {
    // compute the combined phone number string
    return this.buildFullPhoneNumber();
  }

  @Input()
  set placeholder(value: string) {
    this.providedPlaceholder = value;
    this.stateChanges.next();
  }
  get placeholder(): string {
    return this.providedPlaceholder;
  }

  @HostBinding() id = `custom-form-field-id-${TelInputComponent.nextId++}`;
  @HostBinding('attr.aria-describedBy') describedBy = '';
  @HostBinding('class.floated')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }
  get empty(): boolean {
    return this.value == null || this.value === '';
  }

  get formControls() {
    return this.form.controls;
  }

  get errorState(): boolean {
    return this.errorMatcher.isErrorState(this.ngControl.control, null);
  }

  public form: FormGroup;
  public focused!: boolean;
  public autofilled?: boolean;
  public disableAutomaticLabeling?: boolean;
  public controlType = 'custom-form-field';
  public userAriaDescribedBy?: string;
  public searchControl = new FormControl<string>('', { nonNullable: true });
  public filteredOptions = new ReplaySubject<Phone[]>(1);
  public stateChanges = new Subject<void>();

  private countries: Phone[] = allCountries;
  private providedPlaceholder = '';

  @ViewChild('phoneSelect', { static: true }) phoneSelect!: MatSelect;
  @ViewChild(MatInput, { read: ElementRef, static: true }) input!: ElementRef;
  protected onDestroy = new Subject<void>();

  public onChange!: (value: string) => void;
  public onTouched!: () => void;

  constructor() {
    // bind this control as NgControl valueAccessor
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // create internal form
    this.form = this.fb.group({
      code: [''],
      number: [''],
    });
  }

  writeValue(obj: string): void {
    this.value = obj;
    this.stateChanges.next();
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    // save callback to emit changes
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.stateChanges.next();
  }

  ngOnInit(): void {
    // initialize default country, focus monitoring, and subscriptions
    this.setInitialSelection();
    this.monitorFocus();

    // propagate internal form changes to parent
    this.form.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.onChange(this.value));

    // initialize and filter country list
    this.filteredOptions.next(this.countries.slice());
    this.searchControl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.filterCountries());
  }

  ngAfterViewInit(): void {
    // set custom compare function after options render
    this.setInitialValue();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
    this.focusMonitor.stopMonitoring(this.input);
    this.stateChanges.complete();
  }

  // mat-form-field methods
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(): void {
    this.focusMonitor.focusVia(this.input, 'program');
  }

  /**
   * setInitialSelection
   * select default country code (fallback to 'at')
   * @returns void
   */
  private setInitialSelection(): void {
    const foundCountry: Phone = getCountryByAlpha2Code(
      this.formControls['code'].value || 'at'
    );
    if (!foundCountry) return;
    this.formControls['code'].setValue(foundCountry);
  }

  /**
   * monitorFocus
   * watch focus/blur events on the input
   */
  private monitorFocus(): void {
    this.focusMonitor
      .monitor(this.input)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((origin) => {
        this.focused = !!origin;
        this.onTouched();
        this.stateChanges.next();
      });
  }

  /**
   * setInitialValue
   * sets the initial value after the filteredOptions are loaded initially
   */
  private setInitialValue() {
    this.filteredOptions
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        // https://stackblitz.com/github/bithost-gmbh/ngx-mat-select-search-example?file=src%2Fapp%2Fexamples%2F01-single-selection-example%2Fsingle-selection-example.component.ts
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredOptions are loaded initially
        // and after the mat-option elements are available
        this.phoneSelect.compareWith = (a: Phone, b: Phone) =>
          a && b && a.callingCode === b.callingCode;
      });
  }

  /**
   * filterCountries
   * fliter out countries to find out it's calling code based on search query
   * @returns void
   */
  private filterCountries(): void {
    if (!this.countries) {
      return;
    }
    // get the search keyword
    let searchQuery = this.searchControl.value;
    if (!searchQuery) {
      this.filteredOptions.next(this.countries.slice());
      return;
    } else {
      searchQuery = searchQuery.toLowerCase();
    }
    // filter the country
    this.filteredOptions.next(this.onFilter(searchQuery));
  }

  /**
   * onFilter
   * @param value string -> search query
   * @returns Country[]
   */
  private onFilter(value: string): Phone[] {
    const searchQueryLower = value.toLowerCase();

    if (!searchQueryLower) return this.countries.slice(0, 10);

    // filter out the countries based on search query
    return this.countries.filter((option) => {
      const nameLower = option.name.toLocaleLowerCase();
      const codeLower = option.alpha2Code.toLocaleLowerCase();

      if (searchQueryLower.length <= 2) {
        return (
          nameLower.startsWith(searchQueryLower) ||
          codeLower === searchQueryLower
        );
      }

      return (
        nameLower.includes(searchQueryLower) ||
        codeLower.includes(searchQueryLower)
      );
    });
  }

  /**
   * buildFullPhoneNumber
   * build full phone number from selected code and input number
   * @returns string -> build full phone number
   */
  private buildFullPhoneNumber(): string {
    const { code, number } = this.form.value;
    const phoneNumber = code?.callingCode ? code?.callingCode + number : number;
    if (!phoneNumber) return '';
    return phoneNumber.trim();
  }
}
