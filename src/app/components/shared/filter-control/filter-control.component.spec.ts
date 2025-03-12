import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterControlComponent } from './filter-control.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InputControlComponent', () => {
  let component: FilterControlComponent;
  let fixture: ComponentFixture<FilterControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterControlComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
