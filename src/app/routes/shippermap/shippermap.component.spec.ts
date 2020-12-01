import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippermapComponent } from './shippermap.component';

describe('ShippermapComponent', () => {
  let component: ShippermapComponent;
  let fixture: ComponentFixture<ShippermapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippermapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippermapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
