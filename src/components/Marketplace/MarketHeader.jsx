/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import CreateProduct from "./CreateProduct";

export default function MarketHeader({ onSearch }) {
  const searchRef = useRef();
  const [newProduct, setNewProduct] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const search = searchRef.current.value;
    setTimeout(() => onSearch(search), 1500);
  }

  function handleNewProduct() {
    setNewProduct((prevValue) => !prevValue);
  }
  return (
    <>
      <AnimatePresence>
        {newProduct && <CreateProduct onClose={handleNewProduct} />}
      </AnimatePresence>
      <header className="flex justify-center items-center mx-3 flex-col-reverse lg:flex-row md:flex-row pt-5 gap-5 lg:mx-0">
        <motion.form
          initial={{ scale: 0.6, opacity: 0 }}
          viewport={{ once: true }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            ease: "easeInOut",
            type: "spring",
            stiffness: 70,
          }}
          onSubmit={handleSubmit}
          className="market-search py-2 px-5 bg-white rounded-lg flex gap-5"
        >
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.6,
              ease: "easeInOut",
              type: "spring",
              stiffness: 150,
            }}
            className="text-2xl text-gray-600"
          >
            <BiSearch />
          </motion.button>
          <input
            autoComplete="off"
            ref={searchRef}
            onKeyUp={handleSubmit}
            onChange={handleSubmit}
            placeholder={"Search..."}
            type="search"
            name="search"
            id="search"
            className={"w-full h-full outline-none bg-transparent py-2"}
          />
        </motion.form>
        <p className="overflow-hidden px-8">
          <motion.button
            initial={{ x: "-99%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: 0.6,
              ease: "easeInOut",
              type: "spring",
              stiffness: 70,
            }}
            type="button"
            onClick={handleNewProduct}
            className="bg-white rounded-lg px-8 py-2 font-bold"
          >
            Add
          </motion.button>
        </p>
      </header>
    </>
  );
}
