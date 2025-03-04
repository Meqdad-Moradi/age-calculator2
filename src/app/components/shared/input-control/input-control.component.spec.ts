import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputControlComponent } from './input-control.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InputControlComponent', () => {
  let component: InputControlComponent;
  let fixture: ComponentFixture<InputControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputControlComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
