import React from "react";
import clsx from "clsx";

interface AlertProps {
  icon: React.ReactElement;
  message: React.ReactNode;
  type: "success" | "warning" | "error" | "info";
}

const styles = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
  info: "bg-sky-500",
};

const cleanMessage = (msg: React.ReactNode): React.ReactNode => {
  if (typeof msg !== "string") return msg;
  
  // Hide SQL details if they leak to frontend
  if (msg.includes("SQLSTATE") || msg.includes("Integrity constraint violation")) {
    return "A database error occurred. Please try again later.";
  }
  
  return msg;
};

export const Alert = ({ icon, message, type }: AlertProps) => (
  <div className={clsx("flex items-start gap-4 p-1")}>
    <div
      className={clsx(
        "w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg",
        styles[type]
      )}
    >
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <div className="flex flex-col justify-center min-h-[40px]">
      <div className="text-sm font-medium dark:text-white leading-relaxed">
        {cleanMessage(message)}
      </div>
    </div>
  </div>
);
