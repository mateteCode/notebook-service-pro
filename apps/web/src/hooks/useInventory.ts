import { useState, useEffect } from "react";
import api from "../services/api";

export const useInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async (search: string = "") => {
    setLoading(true);
    try {
      // Pasamos un query param para filtrar por compatibilidad o nombre
      const { data } = await api.get(`/inventory?search=${search}`);
      setItems(data);
    } catch (error) {
      console.error("Error fetching inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { items, loading, refetch: fetchInventory };
};
