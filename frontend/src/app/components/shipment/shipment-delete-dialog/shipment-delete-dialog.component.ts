import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Shipment } from '../../../models/shipment.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-shipment-delete-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogModule,
    MatDialogActions,
  ],
  templateUrl: './shipment-delete-dialog.component.html',
  styleUrl: './shipment-delete-dialog.component.scss',
})
export class ShipmentDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ShipmentDeleteDialogComponent>);
  readonly data = inject<Shipment>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.data);
  }
}
