import { PostOffice } from "./PostOffice";

export enum ShipmentStatus {
    ORIGIN = 'ORIGIN',
    DESTINATION = 'DESTINATION',
    DELIVERED = 'DELIVERED',
  }
  
  export enum ShipmentWeight {
    LESS_THAN_1KG = 'LESS_THAN_1KG',
    BETWEEN_1KG_AND_5KG = 'BETWEEN_1KG_AND_5KG',
    MORE_THAN_5KG = 'MORE_THAN_5KG',
  }

  export enum ShipmentType {
    LETTER = 'LETTER',
    PACKAGE = 'PACKAGE'
  }
  
  export interface Shipment {
    type: ShipmentType;
    status: ShipmentStatus;
    weight: ShipmentWeight;
    originPostOffice: string | PostOffice;
    destinationPostOffice: string | PostOffice;
    createdAt: Date;
  }