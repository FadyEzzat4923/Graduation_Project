import { motion } from "framer-motion";

/* eslint-disable react/prop-types */
export default function MainButton({
  onClick,
  className,
  children,
  delay,
  ...props
}) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0.5, 1], opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 60 }}
      {...props}
      onClick={onClick}
      className={`main-button px-20 py-2 font-bold ${className}`}
    >
      {children}
    </motion.button>
  );
}
