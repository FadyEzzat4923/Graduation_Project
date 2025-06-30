/* eslint-disable react/prop-types */
import { IoIosArrowForward } from "react-icons/io";
import NavBarLink from "../../UI/NavBarLink";
import { motion } from "framer-motion";
export default function HomeCard({ src, alt, link, children, right, delay }) {
  return (
    <motion.div
      initial={{ y: 200, x: right ? "80%" : "-80%", opacity: 0 }}
      whileInView={{ y: 0, x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{
        duration: delay ? 1 : 0.6,
        type: "spring",
        stiffness: 40,
      }}
      className="home-card text-center pb-5"
    >
      <img src={src} alt={alt} className="w-4/5 mx-auto" />
      <NavBarLink
        to={link}
        cssClass={
          "card-link my-5 text-xl font-bold flex items-center justify-center gap-3"
        }
      >
        {children}
        <IoIosArrowForward className="transition-all duration-300" />
      </NavBarLink>
    </motion.div>
  );
}
