import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

const StackedNotifications = ({ notification, setNotification }) => {
  const removeNotif = () => {
    setNotification(null);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
      <AnimatePresence>
        {notification && (
          <Notification
            removeNotif={removeNotif}
            key={notification.id}
            {...notification}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const NOTIFICATION_TTL = 5000;

const Notification = ({ text, type, removeNotif }) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif();
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [removeNotif]);

  const bgColor = type === "error" ? "bg-red-600" : "bg-violet-600";

  return (
    <motion.div
      initial={{ y: 15, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -15, scale: 0.9, opacity: 0 }}
      transition={{ type: "spring" }}
      className={`p-4 w-80 flex items-start rounded-lg gap-2 text-sm font-medium shadow-lg text-white ${bgColor}`}
    >
      <FiAlertCircle className="text-xl" />
      <span>{text}</span>
      <button onClick={removeNotif} className="ml-auto">
        <FiX />
      </button>
    </motion.div>
  );
};

export default StackedNotifications;
