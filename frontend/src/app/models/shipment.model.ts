import { ShipmentWeight } from "../enums/shipment-weight.enum";
import { ShipmentStatus } from "../enums/shipment-status.enum";
import { ShipmentType } from "../enums/shipment-type.enum";
import { PostOffice } from "./post-office.model";

export interface Shipment {
  _id?: string;
  type: ShipmentType;
  status: ShipmentStatus;
  weight: ShipmentWeight;
  originPostOffice: PostOffice;
  destinationPostOffice: PostOffice;
  createdAt: Date;
}
