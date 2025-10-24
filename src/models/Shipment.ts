// models/Shipment.ts

import { ShipmentStatus } from "./Enums";

export interface Shipment {
  id: number;
  orderId: number;
  carrier: string;
  trackingNo: string;
  status: ShipmentStatus;  // Using enum from Enums.ts
  shippedAt: string;       // ISO date string
  deliveredAt: string;     // ISO date string
}
