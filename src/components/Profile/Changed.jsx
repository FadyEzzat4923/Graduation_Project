import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Modal from "../UI/Modal";
import changed from "../../assets/changed.png";
import logo from "../../assets/approved_reset.svg";
import MainButton from "../UI/MainButton";
export default function Changed() {
  return (
    <Modal className={"login w-full bg-white p-5"}>
      <Link
        to={"/login/reset"}
        className="backward absolute text-4xl rounded-lg duration-150 hover:bg-purple-400 hover:text-white"
      >
        <RiArrowLeftDoubleFill />
      </Link>
      <div className="w-full h-full flex justify-center items-center lg:gap-x-20 md:gap-x-5">
        <div className="image h-full hidden lg:block md:block">
          <motion.img
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
            src={changed}
            className="h-full"
          />
        </div>
        <div className="login-card flex flex-col justify-center h-full text-center">
          <div className="text-4xl font-bold mb-10">
            <motion.img
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              src={logo}
              className="mx-auto"
            />
          </div>
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 50 }}
            className="mb-3 login-t font-bold text-xl"
          >
            Congratulations
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 50 }}
            className="mb-16 login-p text-sm"
          >
            Your password has been successfully changed
          </motion.p>
          <Link to={"/login"} className="mt-5 w-full">
            <MainButton delay={0.9} className={"w-full px-0"}>
              Done
            </MainButton>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
