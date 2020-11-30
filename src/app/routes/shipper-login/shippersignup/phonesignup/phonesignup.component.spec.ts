import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonesignupComponent } from './phonesignup.component';

describe('PhonesignupComponent', () => {
  let component: PhonesignupComponent;
  let fixture: ComponentFixture<PhonesignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhonesignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonesignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
