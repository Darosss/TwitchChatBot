import {
  iNotification,
  NotificationTitleMessage,
  NOTIFICATION_TYPE,
  Store,
} from "react-notifications-component";

const getNotification = (
  title: NotificationTitleMessage,
  message: NotificationTitleMessage,
  type: NOTIFICATION_TYPE
): iNotification => {
  return {
    title: `${title}`,
    message: `${message}`,
    type: type ? type : "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
    animationOut: ["animate__animated animate__fadeOut"], // `animate.css v4` classes
  };
};

export const addNotification = (
  title: NotificationTitleMessage,
  message: NotificationTitleMessage,
  type: NOTIFICATION_TYPE,
  duration = 5000
) => {
  Store.addNotification({
    ...getNotification(title, message, type),
    dismiss: {
      duration: duration,
      onScreen: true,
    },
  });
};

export const addSuccessNotification = (message: NotificationTitleMessage) =>
  addNotification("Success", message, "success");

export const addErrorNotification = (message: NotificationTitleMessage) =>
  addNotification("Error", message, "danger", 30000);

export const addInfoNotification = (message: NotificationTitleMessage) =>
  addNotification("Info", message, "info", 30000);
