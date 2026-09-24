import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";
import useAuthSession from "./useAuthSession.js";

const useNotifications = () => {
  const session = useAuthSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(
    async ({ shouldUpdate = () => true } = {}) => {
      if (!session?.token) {
        setNotifications([]);
        setUnreadCount(0);
        setError("");
        return;
      }

      try {
        setIsLoading(true);
        const data = await apiRequest("/notifications");

        if (!shouldUpdate()) {
          return;
        }

        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setUnreadCount(Number(data.unreadCount) || 0);
        setError("");
      } catch (requestError) {
        if (!shouldUpdate()) {
          return;
        }

        setError(requestError.message || "Unable to load notifications.");
      } finally {
        if (shouldUpdate()) {
          setIsLoading(false);
        }
      }
    },
    [session?.token],
  );

  const markAllRead = useCallback(async () => {
    if (!session?.token) {
      return;
    }

    await apiRequest("/notifications/read-all", {
      method: "PATCH",
    });
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        readAt: notification.readAt || new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
  }, [session?.token]);

  useEffect(() => {
    let isMounted = true;

    loadNotifications({ shouldUpdate: () => isMounted });

    return () => {
      isMounted = false;
    };
  }, [loadNotifications]);

  return {
    error,
    isLoading,
    markAllRead,
    notifications,
    refreshNotifications: loadNotifications,
    unreadCount,
  };
};

export default useNotifications;
