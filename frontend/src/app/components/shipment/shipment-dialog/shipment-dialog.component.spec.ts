import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDialogComponent } from './shipment-dialog.component';

describe('ShipmentDialogComponent', () => {
  let component: ShipmentDialogComponent;
  let fixture: ComponentFixture<ShipmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
