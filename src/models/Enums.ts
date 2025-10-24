export enum UserRole {
  Customer = 0,
  Admin = 1,
}

export enum OrderStatus {
  Pending = 0,
  Paid = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
  Returned = 5,
}

export enum PaymentStatus {
  Initiated = 0,
  Captured = 1,
  Failed = 2,
  Refunded = 3,
}

export enum ShipmentStatus {
  Pending = 0,
  InTransit = 1,
  Delivered = 2,
  Exception = 3,
  Returned = 4,
}
