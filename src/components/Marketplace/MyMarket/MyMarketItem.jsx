/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import MarketItem from "../MarketItem";

export default function MyMarketItem({ productData, onEdit, onDelete }) {
  function handleEdit(data) {
    onEdit(data);
  }
  function handleStartDelete(id) {
    onDelete(id);
  }

  return (
    <MarketItem {...productData}>
      <div className="actions flex gap-2 my-4">
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring", stiffness: 70 }}
          onClick={() => handleEdit(productData)}
          className="flex gap-2 justify-center items-center px-3 py-1  bg-white rounded-md"
        >
          <BiEdit />
          Edit
        </motion.button>
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          onClick={() => handleStartDelete(productData.id)}
          className="flex gap-2 justify-center items-center  px-3 py-1 bg-red-500 text-white rounded-md"
        >
          <RiDeleteBinLine />
          Delete
        </motion.button>
      </div>
    </MarketItem>
  );
}
