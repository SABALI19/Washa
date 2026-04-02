import { useEffect, useState } from "react";

import { apiRequest, getAuthSession } from "../utils/auth.js";

const useCustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      const session = getAuthSession();

      if (!session?.token) {
        if (isMounted) {
          setOrders([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const data = await apiRequest("/orders");

        if (!isMounted) return;

        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setError("");
      } catch (requestError) {
        if (!isMounted) return;

        setOrders([]);
        setError(requestError.message || "Unable to load orders.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return { orders, isLoading, error };
};

export default useCustomerOrders;
