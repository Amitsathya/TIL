import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippersignupComponent } from './shippersignup.component';

describe('ShippersignupComponent', () => {
  let component: ShippersignupComponent;
  let fixture: ComponentFixture<ShippersignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippersignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippersignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
