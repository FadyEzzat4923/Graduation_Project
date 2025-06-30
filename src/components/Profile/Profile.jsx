import useAuthentication from "../../util/useAuthentication";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { motion } from "framer-motion";
import HelmetIdentify from "../HelmetIdentify";
import Modal from "../UI/Modal";
import MainButton from "../UI/MainButton";

export default function Profile() {
  const user = useAuthentication();
  const navigate = useNavigate();

  function handleSignout() {
    localStorage.removeItem("author");
    localStorage.removeItem("expiration");
    navigate("/home");
  }

  let welcome;
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    welcome = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    welcome = "Good Afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    welcome = "Good Evening";
  } else {
    welcome = "Good Night";
  }

  return (
    <>
      <HelmetIdentify
        title={"Motherhood | Profile"}
        description={
          "User profile page for Helmet Baby Care platform. Manage your account and connect with other mothers."
        }
        keywords={
          "profile, motherhood, baby care, user account, Helmet platform"
        }
      />
      <Modal className="profile w-full overflow-y-auto overflow-x-hidden">
        <Link
          to={"/home"}
          className="backward left-5 top-5 absolute text-4xl rounded-lg duration-150 hover:bg-purple-400 hover:text-white"
        >
          <RiArrowLeftDoubleFill />
        </Link>
        <div className="w-full h-full bg-white mt-32 px-5 rounded-t-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="profile-img relative"
          >
            <div className="absolute flex justify-center items-center bg-white shadow-lg text-gray-500 w-32 h-32 text-6xl font-bold rounded-full">
              {user && user.firstName?.charAt(0).toUpperCase()}
            </div>
          </motion.div>
          <div className="personal-info pt-24">
            <div className="info-header text-center text-l overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, scale: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                {welcome}
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: "300%" }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 70 }}
                className="font-bold"
              >
                {(user && user.firstName + " " + user.lastName) ||
                  "Unknowen Name"}
              </motion.h1>
            </div>
            <div className="info mt-5 max-w-4xl mx-auto text-2xl font-bold overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, x: "-30%" }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 70 }}
                className="mb-3"
              >
                Your Personal Information
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, x: "-30%" }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 70 }}
              >
                First Name
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: "-30%" }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 70 }}
                className="mb-3 text-sm"
              >
                {(user && user.firstName) || "Unknowen Name"}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: "-30%" }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 70 }}
              >
                Last Name
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: "-30%" }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 70 }}
                className="mb-3 text-sm"
              >
                {(user && user.lastName) || "Unknowen Name"}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: "-30%" }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 70 }}
              >
                Email
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: "-30%" }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3, type: "spring", stiffness: 70 }}
                className="mb-10 text-sm"
              >
                {(user && user.email) || "Unknowen Email"}
              </motion.p>
            </div>
            <div className="actions mb-3 w-full flex justify-center flex-wrap lg:flex-nowrap md:flex-nowrap gap-5">
              <Link to={"/edit-profile"}>
                <MainButton delay={1.6} className={"relative"}>
                  Edit Profile
                  <span className="absolute right-5 top-3 text-l">
                    <FaRegEdit />
                  </span>
                </MainButton>
              </Link>
              <MainButton
                delay={1.7}
                onClick={handleSignout}
                className={"relative"}
              >
                Sign Out
                <span className="absolute right-5 top-3 text-l">
                  <PiSignOutFill />
                </span>
              </MainButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
