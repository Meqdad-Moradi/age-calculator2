import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskDialogComponent } from './view-task-dialog.component';

describe('ViewTaskDialogComponent', () => {
  let component: ViewTaskDialogComponent;
  let fixture: ComponentFixture<ViewTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTaskDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
