import axios from "axios";
import type { IDevice } from "../../../api/src/core/interfaces/IDevice.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const repairService = {
  // Obtener todas las reparaciones para la tabla del Dashboard
  getAll: async (): Promise<IDevice[]> => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/repairs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  // Obtener una sola para el detalle/timeline
  getById: async (id: string): Promise<IDevice> => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/repairs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
