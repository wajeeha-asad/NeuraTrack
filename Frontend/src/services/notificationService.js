import api from "./api";

export const getNotifications = () =>
  api("/api/notifications");

export const getUnreadNotificationCount = () =>
  api("/api/notifications/unread-count");

export const markNotificationAsRead = (notificationId) =>
  api(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });

export const markAllNotificationsAsRead = () =>
  api("/api/notifications/read-all", {
    method: "PATCH",
  });