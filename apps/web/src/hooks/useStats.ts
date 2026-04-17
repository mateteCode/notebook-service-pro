import { useState, useEffect } from "react";
import api from "../services/api";

export const useStats = () => {
  const [faultStats, setFaultStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/stats/common-faults");
        setFaultStats(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { faultStats, loading };
};
