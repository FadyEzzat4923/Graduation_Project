/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

export default function HomeIntroCard({ src, alt, title, children }) {
  return (
    <div className="intro-card overflow-hidden">
      <motion.div
        initial={{ x: "-30%", opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring", stiffness: 70 }}
        className="image z-50"
      >
        <img src={src} alt={alt} />
        <h1 className="text-xl font-bold">{title}</h1>
      </motion.div>
      <motion.p
        initial={{ y: "-100%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, type: "spring", stiffness: 70 }}
        className="details"
      >
        {children}
      </motion.p>
    </div>
  );
}
