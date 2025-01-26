import { ShipmentModel } from "../models/Shipment";
import {
  Shipment,
  ShipmentStatus,
  ShipmentType,
  ShipmentWeight,
} from "../entities/Shipment";
import { Types } from "mongoose";

class ShipmentService {
  async getShipments(
    _id?: string,
    status?: ShipmentStatus,
    originPostOffice?: string,
    destinationPostOffice?: string,
    weight?: ShipmentWeight,
    type?: ShipmentType,
    page?: number,
    limit?: number
  ): Promise<[Shipment[], number]> {
    const query: any = {};
    if (_id) {
      if (Types.ObjectId.isValid(_id)) {
        query._id = new Types.ObjectId(_id);
      } else {
        throw new Error("Invalid ID format");
      }
    }
    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }
    if (originPostOffice) {
      query.originPostOffice = originPostOffice;
    }
    if (destinationPostOffice) {
      query.destinationPostOffice = destinationPostOffice;
    }
    if (weight) {
      query.weight = weight;
    }

    const skip = (page || 1) * (limit || 10) - (limit || 10);
    const limitValue = limit || 10;

    const aggregationPipeline = [
      { $match: query },
      {
        $lookup: {
          from: "postoffices",
          localField: "originPostOffice", 
          foreignField: "zipCode",
          as: "originPostOffice",
        },
      },
      {
        $unwind: {
          path: "$originPostOffice",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "postoffices", 
          localField: "destinationPostOffice",
          foreignField: "zipCode",
          as: "destinationPostOffice",
        },
      },
      {
        $unwind: {
          path: "$destinationPostOffice",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $skip: skip },
      { $limit: limitValue },
    ];

    const [shipments, total] = await Promise.all([
      ShipmentModel.aggregate(aggregationPipeline).exec(),
      ShipmentModel.countDocuments(query),
    ]);

    return [shipments, total];
  }

  async createShipment(shipment: Shipment): Promise<Shipment> {
    const newShipment = new ShipmentModel(shipment);
    return await newShipment.save();
  }
  async updateShipment(
    id: string,
    updatedShipmentData: Shipment
  ): Promise<Shipment | null> {
    try {
      const updatedShipment = await ShipmentModel.findByIdAndUpdate(
        id,
        updatedShipmentData,
        { new: true }
      );

      return updatedShipment as Shipment;
    } catch (error) {
      throw error;
    }
  }

  async deleteShipment(id: string): Promise<Shipment | null> {
    try {
      const deletedShipment = await ShipmentModel.findByIdAndDelete(id);
      return deletedShipment;
    } catch (error) {
      console.error("Error deleting Shipment:", error);
      throw error;
    }
  }
}

export default new ShipmentService();
