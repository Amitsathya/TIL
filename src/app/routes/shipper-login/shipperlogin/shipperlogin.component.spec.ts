import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperloginComponent } from './shipperlogin.component';

describe('ShipperloginComponent', () => {
  let component: ShipperloginComponent;
  let fixture: ComponentFixture<ShipperloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipperloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipperloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
