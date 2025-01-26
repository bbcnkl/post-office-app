import { Request, Response } from "express";
import shipmentService from "../services/shipmentService";
import postOfficeService from "../services/postOfficeService";
import {
  Shipment,
  ShipmentStatus,
  ShipmentType,
  ShipmentWeight,
} from "../entities/Shipment";
import { PostOffice } from "../entities/PostOffice";
import { validationResult } from "express-validator";

class ShipmentController {
  async getShipments(req: Request, res: Response) {
    try {
      const {
        _id,
        status,
        originPostOffice,
        destinationPostOffice,
        weight,
        type,
        page,
        limit,
      } = req.query;
      const [shipments, total] = await shipmentService.getShipments(
        _id as string,
        status as ShipmentStatus,
        originPostOffice as string,
        destinationPostOffice as string,
        weight as ShipmentWeight,
        type as ShipmentType,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );
      res.json({ list: shipments, total });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve shipments" });
    }
  }

  async createShipment(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const shipment = req.body as Shipment;
      let createdShipment = await shipmentService.createShipment(shipment);

      const originPostOffice = (await postOfficeService.getPostOfficeByZipCode(
        createdShipment.originPostOffice as string
      )) as PostOffice;
      const destinationPostOffice =
        (await postOfficeService.getPostOfficeByZipCode(
          createdShipment.destinationPostOffice as string
        )) as PostOffice;

      if (!originPostOffice || !destinationPostOffice) {
        res.status(404).json({ error: "PostOffice not found for shipment" });
        return;
      }
      createdShipment.originPostOffice = originPostOffice;
      createdShipment.destinationPostOffice = destinationPostOffice;

      res.status(201).json(createdShipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create shipment" });
    }
  }

  async updateShipment(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const id = req.params.id;
      const shipment = req.body as Shipment;
      let updatedShipment = await shipmentService.updateShipment(id, shipment);
      if (!updatedShipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      const originPostOffice = await postOfficeService.getPostOfficeByZipCode(
        updatedShipment.originPostOffice as string
      );
      const destinationPostOffice =
        await postOfficeService.getPostOfficeByZipCode(
          updatedShipment.destinationPostOffice as string
        );
      if (!originPostOffice || !destinationPostOffice) {
        res.status(404).json({ error: "PostOffice not found for shipment" });
        return;
      }
      updatedShipment.originPostOffice = originPostOffice;
      updatedShipment.destinationPostOffice = destinationPostOffice;

      res.status(201).json(updatedShipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create shipment" });
    }
  }

  async deleteShipment(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedShipment = await shipmentService.deleteShipment(id);
      if (!deletedShipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      res.status(200).json(deletedShipment);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete Shipment" });
    }
  }
}

export default new ShipmentController();
