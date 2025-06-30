import { motion } from "framer-motion";

export default function LoadingPops() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="load-pops flex gap-4 justify-center mt-5 mb-5"
    >
      <div className="w-6 h-6 rounded-full"></div>
      <div className="w-6 h-6 rounded-full"></div>
      <div className="w-6 h-6 rounded-full"></div>
    </motion.div>
  );
}
