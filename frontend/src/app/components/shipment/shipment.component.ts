import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ShipmentService } from '../../services/shipment.service';
import { MatDialog } from '@angular/material/dialog';
import { ShipmentDialogComponent } from './shipment-dialog/shipment-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Shipment } from '../../models/shipment.model';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { FormatEnumPipe } from '../../pipes/format-enum.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PostOfficeService } from '../../services/post-office.service';
import { PostOffice } from '../../models/post-office.model';
import { ShipmentType } from '../../enums/shipment-type.enum';
import { ShipmentStatus } from '../../enums/shipment-status.enum';
import { ShipmentWeight } from '../../enums/shipment-weight.enum';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShipmentDeleteDialogComponent } from './shipment-delete-dialog/shipment-delete-dialog.component';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shipment',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatDividerModule,
    FormatEnumPipe,
  ],
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.scss',
})
export class ShipmentComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    '_id',
    'type',
    'weight',
    'status',
    'originPostOffice',
    'destinationPostOffice',
    'action',
  ];
  dataSource$ = new BehaviorSubject<Shipment[]>([]);
  paginatedData$ = new BehaviorSubject<Shipment[]>([]);
  readonly postOfficeService = inject(PostOfficeService);
  readonly shipmentService = inject(ShipmentService);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly route = inject(ActivatedRoute);

  totalShipments = 0;
  pageSize = 10;
  currentPageIndex = 0;
  postOffices = signal<PostOffice[]>([]);
  readonly shipmentTypes = Object.values(ShipmentType);
  readonly shipmentStatuses = Object.values(ShipmentStatus);
  readonly shipmentWeights = Object.values(ShipmentWeight);
  private destroy$ = new Subject<void>();

  filterData = {
    _id: '',
    originPostOffice: '',
    destinationPostOffice: '',
    type: '',
    weight: '',
    status: '',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.initializePostOffices();
    this.applyInitialFilters();
    this.loadShipments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializePostOffices(): void {
    const postOfficesData = this.route.snapshot.data['postOffices']?.list;
    this.postOffices.set(postOfficesData || []);
  }

  private applyInitialFilters(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['originPostOffice']) {
      this.filterData.originPostOffice = queryParams['originPostOffice'];
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    this.loadShipments();
  }

  openShipmentDialog(isEdit: boolean = false, shipment?: Shipment) {
    const dialogRef = this.dialog.open(ShipmentDialogComponent, {
      data: isEdit ? shipment : {},
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          if (isEdit && shipment?._id) {
            this.updateShipment(result, shipment?._id);
          } else {
            this.createShipment(result);
          }
        }
      });
  }

  openDeleteDialog(shipment: Shipment): void {
    const dialogRef = this.dialog.open(ShipmentDeleteDialogComponent, {
      data: shipment,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.deleteShipment(result._id);
        }
      });
  }

  filterTable(filterType?: string) {
    if (filterType === '_id') {
      if (this.filterData._id.trim().length === 24) {
        this.loadShipments();
      } else if (this.filterData._id.trim().length === 0) {
        // reset on delete
        this.loadShipments();
      }
    } else {
      this.filterData._id = '';
      this.loadShipments();
    }
  }

  async loadShipments() {
    const filters = {
      page: this.currentPageIndex + 1,
      limit: this.pageSize,
      _id: this.filterData._id.trim(),
      originPostOffice: this.filterData.originPostOffice,
      destinationPostOffice: this.filterData.destinationPostOffice,
      type: this.filterData.type,
      status: this.filterData.status,
      weight: this.filterData.weight,
    };

    try {
      const shipments = await this.shipmentService.loadAllShipments(filters);
      this.dataSource$.next(shipments.list);
      this.totalShipments = shipments.total;
    } catch (err) {
      this.snackBar.open('Error loading shipments', '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }

  async createShipment(shipment: Shipment) {
    try {
      const newShipment = await this.shipmentService.createShipment(shipment);
      const updatedData = [newShipment, ...this.dataSource$.value];
      this.dataSource$.next(updatedData);
      this.totalShipments += 1;
      this.paginator.length = this.totalShipments;
    } catch (err) {
      this.snackBar.open('Error creating shipment', '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }

  async updateShipment(shipment: Shipment, id: string) {
    try {
      const updatedShipment = await this.shipmentService.updateShipment(
        shipment,
        id
      );
      const updatedData = this.dataSource$.value.map((s) =>
        s._id === id ? updatedShipment : s
      );
      this.dataSource$.next(updatedData);
    } catch (err) {
      this.snackBar.open('Error updating shipment', '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }

  async deleteShipment(id: string) {
    try {
      this.shipmentService.deleteShipment(id);
      const updatedData = this.dataSource$.value.filter((s) => s._id !== id);
      this.dataSource$.next(updatedData);
      this.totalShipments--;
    } catch (err: any) {
      this.snackBar.open('Error: ' + err?.error?.error, '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }
}
