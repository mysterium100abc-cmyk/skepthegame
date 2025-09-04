interface NotificationOptions {
  title?: string;
  body?: string;
  icon?: string;
  timeout?: number; // ms
  onClick?: () => void;
}

export async function sendNotification({
  title = "Notification",
  body = "",
  icon = "",
  timeout = 5000,
  onClick,
}: NotificationOptions) {
  if (typeof window === "undefined") {
    console.warn("Notifications not supported in this environment");
    return;
  }

  try {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      await Notification.requestPermission();
    }

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );

    if (isMobile && "serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        registration.showNotification(title, { body, icon });
        return;
      }
    }

    if (!isMobile && Notification.permission === "granted") {
      const notification = new Notification(title, { body, icon });
      if (timeout > 0) setTimeout(() => notification.close(), timeout);
      notification.onclick = () => {
        window.focus();
        if (onClick) onClick();
      };
      return;
    }
  } catch (err) {
    console.error("Notification failed:", err);
  }
}
