import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationItemComponent } from './calculation-item.component';

describe('CalculationItemComponent', () => {
  let component: CalculationItemComponent;
  let fixture: ComponentFixture<CalculationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculationItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
