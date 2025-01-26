import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ShipmentService } from './shipment.service';
import { environment } from '../../environments/environment';
import { GetShipmentsResponse } from '../models/get-shipments.response';
import { Shipment } from '../models/shipment.model';
import { ShipmentStatus } from '../enums/shipment-status.enum';
import { ShipmentWeight } from '../enums/shipment-weight.enum';
import { ShipmentType } from '../enums/shipment-type.enum';

describe('ShipmentService', () => {
  let service: ShipmentService;
  let httpMock: HttpTestingController;
  const apiRoot = environment.apiRoot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShipmentService],
    });

    service = TestBed.inject(ShipmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load all shipments', async () => {
    const mockResponse: GetShipmentsResponse = {
      list: [
        {
          _id: '1',
          status: ShipmentStatus.DELIVERED,
          weight: ShipmentWeight.BETWEEN_1KG_AND_5KG,
          destinationPostOffice: { zipCode: '11000', location: 'Beograd' },
          originPostOffice: { location: 'Novi Sad', zipCode: '21000' },
          type: ShipmentType.LETTER,
          createdAt: new Date(),
        },
      ],
      total: 1,
    };
    const filters = { status: 'Shipped', page: 1, limit: 10 };

    const response = await service.loadAllShipments(filters);
    expect(response).toEqual(mockResponse);

    const req = httpMock.expectOne(
      `${apiRoot}/shipment/list?_id=&status=Shipped&type=&originPostOffice=&destinationPostOffice=&weight=&page=1&limit=10`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a shipment', async () => {
    const mockShipment: Shipment = {
      _id: '1',
      status: ShipmentStatus.DELIVERED,
      weight: ShipmentWeight.BETWEEN_1KG_AND_5KG,
      destinationPostOffice: { zipCode: '11000', location: 'Beograd' },
      originPostOffice: { location: 'Novi Sad', zipCode: '21000' },
      type: ShipmentType.LETTER,
      createdAt: new Date(),
    };
    const shipmentData: Partial<Shipment> = {};

    const response = await service.createShipment(shipmentData);
    expect(response).toEqual(mockShipment);

    const req = httpMock.expectOne(`${apiRoot}/shipment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(shipmentData);
    req.flush(mockShipment);
  });

  it('should update a shipment', async () => {
    const mockShipment: Shipment = {
      _id: '1',
      status: ShipmentStatus.DELIVERED,
      weight: ShipmentWeight.BETWEEN_1KG_AND_5KG,
      destinationPostOffice: { zipCode: '11000', location: 'Beograd' },
      originPostOffice: { location: 'Novi Sad', zipCode: '21000' },
      type: ShipmentType.LETTER,
      createdAt: new Date(),
    };
    const shipmentChanges: Partial<Shipment> = {
      status: ShipmentStatus.DELIVERED,
      weight: ShipmentWeight.BETWEEN_1KG_AND_5KG,
      destinationPostOffice: { zipCode: '11000', location: 'Beograd' },
      originPostOffice: { location: 'Novi Sad', zipCode: '21000' },
      type: ShipmentType.LETTER,
      createdAt: new Date(),
    };

    const response = await service.updateShipment(shipmentChanges, '1');
    expect(response).toEqual(mockShipment);

    const req = httpMock.expectOne(`${apiRoot}/shipment/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(shipmentChanges);
    req.flush(mockShipment);
  });

  it('should delete a shipment', async () => {
    const shipmentId = '1';
    const response = await service.deleteShipment(shipmentId);
    expect(response).toBeNull();

    const req = httpMock.expectOne(`${apiRoot}/shipment/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
