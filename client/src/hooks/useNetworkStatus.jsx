import { useEffect, useState } from "react";

function useInternetStatus(
  pingUrl = "https://www.google.com/favicon.ico",
  intervalMs = 15000
) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let intervalId;

    const fetchWithTimeout = (url, options, timeout = 5000) => {
      return Promise.race([
        fetch(url, { ...options, mode: "no-cors", cache: "no-store" }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), timeout)
        ),
      ]);
    };

    const checkConnection = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }

      try {
        await fetchWithTimeout(pingUrl, { method: "HEAD" });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    // Event listeners for instant response
    const goOnline = () => checkConnection();
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    // First check immediately
    checkConnection();

    // Keep checking in background
    intervalId = setInterval(checkConnection, intervalMs);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      clearInterval(intervalId);
    };
  }, [pingUrl, intervalMs]);

  return isOnline;
}

export default useInternetStatus;
