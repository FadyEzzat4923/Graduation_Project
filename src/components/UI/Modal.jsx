/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

export default function Modal({ hideModal, className, children, deleteModal }) {
  let content = (
    <motion.div
      initial={{ y: "-20%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-20%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className="modal"
    >
      <div className="backdrop w-full h-full" onClick={hideModal} />
      <dialog className={className} open>
        {children}
      </dialog>
    </motion.div>
  );
  if (deleteModal) {
    content = (
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 70 }}
        className="modal"
      >
        <div className="backdrop w-full h-full" onClick={hideModal} />
        <motion.dialog
          initial={{ translateY: "-20%", opacity: 0 }}
          animate={{ translateY: "-50%", opacity: 1 }}
          exit={{ translateY: "-20%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 70 }}
          className={className}
          open
        >
          {children}
        </motion.dialog>
      </motion.div>
    );
  }
  return content;
}
