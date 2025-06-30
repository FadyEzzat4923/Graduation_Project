/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
export default function GuideCard({ title, children }) {
  const dir = ["-5%", "5%"];
  const randomDir = dir[Math.floor(Math.random() * 2)];
  return (
    <motion.div
      initial={{ x: randomDir, y: 50, opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
        type: "tween",
        bounce: 300,
      }}
      className="guide-card overflow-hidden mt-14 py-10 mx-4 px-10 lg:px-20 rounded-3xl lg:rounded-full transition-all duration-200"
    >
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <div className="card-body">{children}</div>
    </motion.div>
  );
}
