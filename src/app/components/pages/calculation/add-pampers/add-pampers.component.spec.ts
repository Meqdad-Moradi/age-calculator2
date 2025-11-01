import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPampersComponent } from './add-pampers.component';

describe('AddPampersComponent', () => {
  let component: AddPampersComponent;
  let fixture: ComponentFixture<AddPampersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPampersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPampersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
