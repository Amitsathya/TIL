import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriermapComponent } from './carriermap.component';

describe('CarriermapComponent', () => {
  let component: CarriermapComponent;
  let fixture: ComponentFixture<CarriermapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarriermapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarriermapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
