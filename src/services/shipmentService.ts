import { api } from "./api";
import { Shipment } from "../models/Shipment";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Create shipment
 */
export const createShipment = async (shipment: Partial<Shipment>, token: string): Promise<Shipment> => {
  const res = await api.post<GenericResponse<Shipment>>("/api/Shipment", shipment, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Shipment creation failed");

  return data.result;
};

/**
 * ✅ Read shipment by ID
 */
export const fetchShipmentById = async (id: number, token: string): Promise<Shipment> => {
  const res = await api.get<GenericResponse<Shipment>>(`/api/Shipment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Shipment fetch failed");

  return data.result;
};

/**
 * ✅ Update shipment
 */
export const updateShipment = async (shipment: Partial<Shipment>, token: string): Promise<Shipment> => {
  const res = await api.put<GenericResponse<Shipment>>("/api/Shipment", shipment, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Shipment update failed");

  return data.result;
};

/**
 * ✅ Delete shipment
 */
export const deleteShipment = async (id: number, token: string): Promise<Shipment> => {
  const res = await api.delete<GenericResponse<Shipment>>(`/api/Shipment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Shipment delete failed");

  return data.result;
};

/**
 * ✅ Search shipments
 */
export const searchShipments = async (filter: Partial<Shipment>, token: string): Promise<Shipment[]> => {
  const res = await api.post<GenericResponse<Shipment[]>>("/api/Shipment/search", filter, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Shipment search failed");

  return data.result;
};
