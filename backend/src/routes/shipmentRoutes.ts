import express from "express";
import shipmentController from "../controllers/shipmentController";
import { body } from "express-validator";

const router = express.Router();

router.get("/list", shipmentController.getShipments);

router.post(
  "/",
  body("originPostOffice")
    .notEmpty()
    .withMessage("Origin Post Office is required"),
  body("destinationPostOffice")
    .notEmpty()
    .withMessage("Destination Post Office is required"),
  body("weight").notEmpty().withMessage("weight is required"),
  body("type").notEmpty().withMessage("type is required"),
  body("status").notEmpty().withMessage("status is required"),
  shipmentController.createShipment
);
router.put(
  "/:id",
  body("originPostOffice")
    .notEmpty()
    .withMessage("Origin Post Office is required"),
  body("destinationPostOffice")
    .notEmpty()
    .withMessage("Destination Post Office is required"),
  body("weight").notEmpty().withMessage("weight is required"),
  body("type").notEmpty().withMessage("type is required"),
  body("status").notEmpty().withMessage("status is required"),
  shipmentController.updateShipment
);

router.delete("/:id", shipmentController.deleteShipment);

export default router;
