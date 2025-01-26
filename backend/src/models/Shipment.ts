import mongoose, { Document, Schema } from 'mongoose';
import { Shipment, ShipmentStatus, ShipmentType, ShipmentWeight } from '../entities/Shipment';

const shipmentSchema: Schema = new mongoose.Schema<Shipment>({
  type: {
    type: String,
    enum: Object.values(ShipmentType),
    required: true,
  }, 
  status: {
    type: String,
    enum: Object.values(ShipmentStatus),
    required: true,
  },
  weight: {
    type: String,
    enum: Object.values(ShipmentWeight),
    required: true,
  },
  originPostOffice: {
    type: Object,
    required: true,
  },
  destinationPostOffice: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ShipmentModel = mongoose.model<Shipment & Document>('Shipment', shipmentSchema);