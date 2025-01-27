import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Shipment } from '../../../models/shipment.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

import { ShipmentType } from '../../../enums/shipment-type.enum';
import { ShipmentStatus } from '../../../enums/shipment-status.enum';
import { ShipmentWeight } from '../../../enums/shipment-weight.enum';
import { CommonModule } from '@angular/common';
import { FormatEnumPipe } from '../../../pipes/format-enum.pipe';
import { PostOffice } from '../../../models/post-office.model';
import { PostOfficeService } from '../../../services/post-office.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shipment-dialog',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatSelectModule,
    FormatEnumPipe,
  ],
  templateUrl: './shipment-dialog.component.html',
  styleUrl: './shipment-dialog.component.scss',
})
export class ShipmentDialogComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ShipmentDialogComponent>);
  readonly snackBar = inject(MatSnackBar);
  readonly data = inject<Shipment>(MAT_DIALOG_DATA);
  shipmentForm!: FormGroup;
  readonly shipmentTypes = Object.values(ShipmentType);
  readonly shipmentStatuses = Object.values(ShipmentStatus);
  readonly shipmentWeights = Object.values(ShipmentWeight);
  postOffices = signal<PostOffice[]>([]);
  filteredPostOffices = signal<PostOffice[]>(this.postOffices());

  readonly postOfficeService = inject(PostOfficeService);

  ngOnInit(): void {
    this.shipmentForm = this.fb.group({
      type: [this.data.type ?? this.shipmentTypes[0], Validators.required],
      status: [
        this.data.status ?? this.shipmentStatuses[0],
        [Validators.required],
      ],
      weight: [
        this.data.weight ?? this.shipmentWeights[0],
        [Validators.required],
      ],
      originPostOffice: [
        this.data.originPostOffice?.zipCode ?? '',
        [Validators.required],
      ],
      destinationPostOffice: [
        this.data.destinationPostOffice?.zipCode ?? '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
    });

    this.shipmentForm
      .get('destinationPostOffice')
      ?.valueChanges.subscribe((value) => {
        this._filterPostOffices(value);
      });
    this.loadPostOffices();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.shipmentForm.valid) {
      const savedShipment = this.shipmentForm.value as Shipment;
      this.dialogRef.close(savedShipment);
    }
  }

  async loadPostOffices() {
    try {
      const postOffices = await this.postOfficeService.loadAllPostOffices();
      this.postOffices.set(postOffices?.list);
    } catch (err) {
      this.snackBar.open('Error loading Post Offices ', '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }

  private _filterPostOffices(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredPostOffices.set(
      this.postOffices().filter(
        (postOffice) =>
          postOffice.zipCode.toLowerCase().includes(filterValue) ||
          postOffice.location.toLowerCase().includes(filterValue)
      )
    );
  }
}
