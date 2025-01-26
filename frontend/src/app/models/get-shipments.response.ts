import { Shipment } from "./shipment.model"

export type GetShipmentsResponse = {
  list: Shipment[],
  total: number
}
