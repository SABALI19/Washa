import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useAdminStaffManagement = () => {
  const [staffManagement, setStaffManagement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStaffManagement = useCallback(
    async ({ shouldUpdate = () => true } = {}) => {
      try {
        setIsLoading(true);
        const data = await apiRequest("/admin/staff");

        if (!shouldUpdate()) {
          return;
        }

        setStaffManagement(data.staffManagement || null);
        setError("");
      } catch (requestError) {
        if (!shouldUpdate()) {
          return;
        }

        setStaffManagement(null);
        setError(requestError.message || "Unable to load staff management.");
      } finally {
        if (shouldUpdate()) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    loadStaffManagement({ shouldUpdate: () => isMounted });

    return () => {
      isMounted = false;
    };
  }, [loadStaffManagement]);

  return {
    error,
    isLoading,
    refreshStaffManagement: loadStaffManagement,
    staffManagement,
  };
};

export default useAdminStaffManagement;
