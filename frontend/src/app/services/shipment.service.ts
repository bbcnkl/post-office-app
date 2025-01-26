import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GetShipmentsResponse } from '../models/get-shipments.response';
import { firstValueFrom } from 'rxjs';
import { Shipment } from '../models/shipment.model';

interface ShipmentFilter {
  _id?: string;
  status?: string;
  originPostOffice?: string;
  destinationPostOffice?: string;
  type?: string;
  weight?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  http = inject(HttpClient);
  env = environment;

  constructor() {}

  async loadAllShipments(
    filters: ShipmentFilter
  ): Promise<GetShipmentsResponse> {
    const params = new HttpParams()
      .set('_id', filters._id || '')
      .set('status', filters.status || '')
      .set('type', filters.type || '')
      .set('originPostOffice', filters.originPostOffice || '')
      .set('destinationPostOffice', filters.destinationPostOffice || '')
      .set('weight', filters.weight || '')
      .set('page', filters.page?.toString() || '1')
      .set('limit', filters.limit?.toString() || '10');

    const shipments$ = this.http.get<GetShipmentsResponse>(
      `${this.env.apiRoot}/shipment/list`, { params }
    );
    const response = await firstValueFrom(shipments$);
    return response;
  }

  async createShipment(data: Partial<Shipment>): Promise<Shipment> {
    const createShipment$ = this.http.post<Shipment>(
      `${this.env.apiRoot}/shipment`,
      data
    );
    return firstValueFrom(createShipment$);
  }

  async updateShipment(
    changes: Partial<Shipment>,
    id: string
  ): Promise<Shipment> {
    const shipment$ = this.http.put<Shipment>(
      `${this.env.apiRoot}/shipment/${id}`,
      changes
    );
    return firstValueFrom(shipment$);
  }

  async deleteShipment(id: string) {
    const delete$ = this.http.delete(`${this.env.apiRoot}/shipment/${id}`);
    return firstValueFrom(delete$);
  }
}
