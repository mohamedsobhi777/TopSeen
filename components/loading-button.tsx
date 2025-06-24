"use client";

import { AnimatePresence, motion } from "framer-motion";

const buttonCopy = {
  idle: "Generate with ai",
  loading: <LoadingSpinner size={16} color="rgba(0, 0, 0, 0.65)" />,
  success: "Success!",
  error: "Try again!",
} as const;

export function LoadingButton({
  status,
  type = "button",
  disabled,
}: {
  status: "loading" | "idle" | "success" | "error";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      className="loading-button"
      disabled={status === "loading" || disabled}
      type={type}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          key={status}
        >
          {buttonCopy[status]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const bars = Array(12).fill(0);

export function LoadingSpinner({
  color,
  size = 20,
}: {
  color: string;
  size?: number;
}) {
  return (
    <div
      className="wrapper"
      style={
        {
          ["--spinner-size"]: `${size}px`,
          ["--spinner-color"]: color,
        } as React.CSSProperties
      }
    >
      <div className="spinner">
        {bars.map((_, i) => (
          <div className="bar" key={`spinner-bar-${i}`} />
        ))}
      </div>
    </div>
  );
}
