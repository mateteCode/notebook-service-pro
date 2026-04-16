import { useState, useEffect } from "react";
import api from "../services/api";

export const useRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRepairs = async () => {
    try {
      const { data } = await api.get("/repairs"); // Endpoint que hicimos en el backend
      setRepairs(data);
    } catch (error) {
      console.error("Error fetching repairs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  return { repairs, loading, refetch: fetchRepairs };
};
