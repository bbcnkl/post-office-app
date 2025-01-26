import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDeleteDialogComponent } from './shipment-delete-dialog.component';

describe('ShipmentDialogComponent', () => {
  let component: ShipmentDeleteDialogComponent;
  let fixture: ComponentFixture<ShipmentDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
